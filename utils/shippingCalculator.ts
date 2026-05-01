import { createClient } from '@supabase/supabase-js';

// Définition des types pour la rigueur
export interface Dimensions {
    length: number;
    width: number;
    height: number;
    unit: string;
}

export interface CartItem {
    productId: string;
    quantity: number;
    weightGrams: number;
    dimensions: Dimensions;
    originCountry: string; // 'MA' | 'FR'
    isStackable: boolean;
    price: number;
    handlingTier: 'standard' | 'fragile' | 'oversize';
    shippingProfileId?: string | null; // Shipping profile assigned to this product
}

import { getCountryByCode } from '@/lib/countries';

// ─── Zone Mapping ───────────────────────────────────────────────────────────────
// Maps a customer's country code to an ordered list of zones to try in the 
// shipping_profile_destinations table. First match wins.

function mapCountryToZone(countryCode: string): string[] {
    const country = getCountryByCode(countryCode);
    if (!country) return [countryCode, 'ROW'];
    
    if (country.region === 'EU') {
        return [countryCode, 'EU', 'ROW'];
    }
    
    return [countryCode, 'ROW'];
}

// ─── Profile-Based Shipping ─────────────────────────────────────────────────────

interface ProfileRate {
    base_price_cents: number;
    additional_price_cents: number;
}

/**
 * Fetches the applicable rate for a given shipping profile and destination zones.
 * Tries zones in order (e.g. ['FR', 'EU']) and returns the first match.
 */
async function getProfileDestinationRate(
    supabase: any,
    profileId: string,
    zones: string[]
): Promise<ProfileRate | null> {
    // Fetch all destinations for this profile that match any of our candidate zones
    const { data, error } = await supabase
        .from('shipping_profile_destinations')
        .select('zone, base_price_cents, additional_price_cents')
        .eq('profile_id', profileId)
        .in('zone', zones) as { data: { zone: string; base_price_cents: number; additional_price_cents: number }[] | null; error: any };

    if (error || !data || data.length === 0) return null;

    // Return the first zone match in priority order
    for (const zone of zones) {
        const match = data.find(d => d.zone === zone);
        if (match) {
            return {
                base_price_cents: match.base_price_cents,
                additional_price_cents: match.additional_price_cents,
            };
        }
    }

    return null;
}

/**
 * Calculates shipping for items that have a shipping profile assigned.
 * 
 * Business rule (paniers mixtes) :
 *   Frais = MAX(base_price de tous les profils) + SUM(additional_price des articles restants)
 * 
 * The item with the highest base_price is the "leader".
 * Leader cost  = base_price + (quantity - 1) * additional_price
 * Other items  = quantity * additional_price
 */
async function calculateProfileShipping(
    supabase: any,
    profileItems: CartItem[],
    destinationCountry: string
): Promise<number> {
    const zones = mapCountryToZone(destinationCountry);

    // Resolve rates for each item
    const itemRates: { item: CartItem; rate: ProfileRate }[] = [];

    for (const item of profileItems) {
        if (!item.shippingProfileId) continue;
        const rate = await getProfileDestinationRate(supabase, item.shippingProfileId, zones);
        if (rate) {
            itemRates.push({ item, rate });
        }
        // If no rate found for this profile+zone → skip (item ships for free or fallback)
    }

    if (itemRates.length === 0) return 0;

    // Find the leader: item with the highest base_price_cents
    let leaderIndex = 0;
    for (let i = 1; i < itemRates.length; i++) {
        if (itemRates[i].rate.base_price_cents > itemRates[leaderIndex].rate.base_price_cents) {
            leaderIndex = i;
        }
    }

    let totalCents = 0;

    for (let i = 0; i < itemRates.length; i++) {
        const { item, rate } = itemRates[i];

        if (i === leaderIndex) {
            // Leader: base price + (quantity - 1) * additional
            totalCents += rate.base_price_cents + (item.quantity - 1) * rate.additional_price_cents;
        } else {
            // Non-leader: all units use additional price
            totalCents += item.quantity * rate.additional_price_cents;
        }
    }

    return totalCents;
}

// ─── Main Entry Point ───────────────────────────────────────────────────────────

/**
 * Calcule les frais de port totaux.
 * 
 * HYBRID LOGIC:
 * 1. Items WITH a shipping profile → profile-based calculation (base + additional)
 * 2. Items WITHOUT a profile → legacy weight-based calculation
 * 3. Total = sum of both
 */
export async function calculateShipping(
    cartItems: CartItem[],
    destinationCountry: string
): Promise<{ totalCost: number, details: any }> {

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ── Split items into profile vs. legacy ──
    const withProfile = cartItems.filter(i => i.shippingProfileId);
    const withoutProfile = cartItems.filter(i => !i.shippingProfileId);

    let profileShippingCost = 0;
    let legacyShippingCost = 0;
    const shipmentDetails: any[] = [];

    // ── 1. Profile-based items ──
    if (withProfile.length > 0) {
        profileShippingCost = await calculateProfileShipping(supabase, withProfile, destinationCountry);
        shipmentDetails.push({
            type: 'profile',
            itemCount: withProfile.length,
            cost: profileShippingCost,
        });
    }

    // ── 2. Legacy weight-based items (existing algorithm, unchanged) ──
    if (withoutProfile.length > 0) {
        legacyShippingCost = await calculateLegacyShipping(withoutProfile, destinationCountry);
        shipmentDetails.push({
            type: 'legacy_weight',
            itemCount: withoutProfile.length,
            cost: legacyShippingCost,
        });
    }

    const totalShippingCost = profileShippingCost + legacyShippingCost;

    return { totalCost: totalShippingCost, details: shipmentDetails };
}

// ─── Legacy Weight-Based Shipping (preserved as-is) ─────────────────────────────

async function calculateLegacyShipping(
    cartItems: CartItem[],
    destinationCountry: string
): Promise<number> {

    // 1. Regroupement des items par Origine (Split-Cart Logic)
    const shipments = new Map<string, CartItem[]>();

    cartItems.forEach(item => {
        const origin = item.originCountry || 'MA'; // Default to MA if missing
        if (!shipments.has(origin)) shipments.set(origin, []);
        shipments.get(origin)?.push(item);
    });

    let totalShippingCost = 0;

    // 2. Itération sur chaque groupe d'expédition
    for (const [origin, items] of shipments) {
        let totalRealWeight = 0;
        let effectiveVolume = 0;
        let surcharge = 0;

        // Séparation des items empilables et non-empilables
        const stackables = items.filter(i => i.isStackable);
        const nonStackables = items.filter(i => !i.isStackable);

        // --- Logique "Poupées Russes" (Nesting) ---
        if (stackables.length > 0) {
            // On trie par volume décroissant
            stackables.sort((a, b) => getVolume(b.dimensions) - getVolume(a.dimensions));

            // Largest item(s) full volume
            effectiveVolume += getVolume(stackables[0].dimensions) * stackables[0].quantity;

            // Smaller items (or subsequent items in sorted list) add 20% volume
            for (let i = 1; i < stackables.length; i++) {
                effectiveVolume += (getVolume(stackables[i].dimensions) * 0.2) * stackables[i].quantity;
            }
        }

        // Ajout des volumes non empilables (somme simple)
        nonStackables.forEach(item => {
            effectiveVolume += getVolume(item.dimensions) * item.quantity;
        });

        // Calcul des poids
        items.forEach(item => {
            totalRealWeight += item.weightGrams * item.quantity;
            // Ajout des frais de manutention pour objets fragiles (Tamegroute)
            if (item.handlingTier === 'fragile') {
                surcharge += 500 * item.quantity; // ex: +5.00€ par pièce fragile pour l'emballage
            }
        });

        // Poids Volumétrique (Diviseur 5000 standard IATA)
        // DÉSACTIVÉ EN URGENCE : C'est ce qui causait les 33€ de livraison !
        const volumetricWeightGrams = 0; // (effectiveVolume / 5000) * 1000;

        // Le poids facturable est maintenant uniquement le poids réel
        const billableWeightGrams = Math.max(totalRealWeight, volumetricWeightGrams);

        // 3. Interrogation de la base de données pour le tarif
        const rateCost = await getRateFromMatrix(origin, destinationCountry, billableWeightGrams);

        const shipmentCost = rateCost + surcharge;
        totalShippingCost += shipmentCost;
    }

    return totalShippingCost;
}

// Utilitaire volume
function getVolume(d: Dimensions): number {
    if (!d) return 0;
    return d.length * d.width * d.height;
}

// Fonction d'accès DB (legacy fallback rates)
async function getRateFromMatrix(origin: string, dest: string, weightGrams: number): Promise<number> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Try to fetch real rates from DB
    const { data: rates, error } = await supabase
        .from('shipping_rates')
        .select('*')
        .eq('origin_warehouse_code', origin === 'MA' ? 'MA_RAK_01' : 'FR_AIX_01') // Map simple origin to warehouse code
        .lte('min_weight_grams', weightGrams)
        .order('price_cents', { ascending: true }); // Get cheapest applicable rate? 
    // Actually we need to match the weight range. 
    // Usually rates are defined like: 0-1kg, 1-2kg.
    // So we want min_weight <= weight AND (max_weight >= weight OR max_weight IS NULL)

    // Since we don't have data yet, we'll fallback to the mock logic from the report if DB returns nothing
    // But let's try to implement the query correctly.

    /*
    const { data: exactRate } = await supabase
        .from('shipping_rates')
        .select('price_cents')
        .eq('origin_warehouse_code', origin === 'MA' ? 'MA_RAK_01' : 'FR_AIX_01')
        .lte('min_weight_grams', weightGrams)
        .or(`max_weight_grams.gte.${weightGrams},max_weight_grams.is.null`)
        .single();
        
    if (exactRate) return exactRate.price_cents;
    */

    // Fallback Mock Logic (as requested in report)

    // 1. Maroc -> France (Zone 1)
    if (origin === 'MA' && dest === 'FR') {
        // Base 25€ + 4€ par Kg
        return 2500 + (weightGrams / 1000) * 400;
    }

    // 2. Maroc -> Europe (Zone 2)
    const europeCodes = ['BE', 'CH', 'DE', 'ES', 'IT', 'NL', 'LU', 'GB', 'PT', 'AT', 'SE', 'DK', 'FI', 'IE'];
    if (origin === 'MA' && europeCodes.includes(dest)) {
        // Base 35€ + 5€ par Kg
        return 3500 + (weightGrams / 1000) * 500;
    }

    // 3. Maroc -> Monde (Zone 3 - USA, Canada, etc.)
    if (origin === 'MA') {
        // Base 55€ + 8€ par Kg (DHL Express estimation)
        return 5500 + (weightGrams / 1000) * 800;
    }

    // 4. France -> France
    if (origin === 'FR' && dest === 'FR') {
        // Base 8€ + 1€ par Kg
        return 800 + (weightGrams / 1000) * 100;
    }

    // 5. France -> Europe
    if (origin === 'FR' && europeCodes.includes(dest)) {
        // Base 15€ + 2€ par Kg
        return 1500 + (weightGrams / 1000) * 200;
    }

    // 6. France -> Monde
    if (origin === 'FR') {
        // Base 30€ + 5€ par Kg
        return 3000 + (weightGrams / 1000) * 500;
    }

    return 5000; // Default fallback safety
}
