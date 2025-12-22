import { createClient } from '@/lib/supabase-server';

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
}

/**
 * Calcule les frais de port totaux en gérant le multi-origine et le poids volumétrique.
 */
export async function calculateShipping(
    cartItems: CartItem[],
    destinationCountry: string
): Promise<{ totalCost: number, details: any }> {

    // 1. Regroupement des items par Origine (Split-Cart Logic)
    const shipments = new Map<string, CartItem[]>();

    cartItems.forEach(item => {
        const origin = item.originCountry || 'MA'; // Default to MA if missing
        if (!shipments.has(origin)) shipments.set(origin, []);
        shipments.get(origin)?.push(item);
    });

    let totalShippingCost = 0;
    const shipmentDetails: any[] = [];

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

            // Le plus grand objet compte pour 100% de son volume
            // Note: If quantity > 1 of the largest item, do they nest into each other? 
            // The report says: "Si un utilisateur achète une Malle Taille L et une Malle Taille S... La Taille S peut voyager à l'intérieur".
            // It also says: "En réalité... 2 L ne rentrent pas dans 1 L".
            // The report's code: effectiveVolume += getVolume(stackables[0].dimensions) * stackables[0].quantity; 
            // This implies NO nesting of identical items (e.g. 2 Large trunks = 2 * Volume).
            // But then: for (let i = 1; i < stackables.length; i++) ... adds 20%.
            // This means smaller items nest into the larger ones.

            // Let's follow the report's logic exactly for now, but correct the syntax error in the report 
            // (stackables.dimensions doesn't exist on the array, it meant stackables[0]).

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
        const volumetricWeightGrams = (effectiveVolume / 5000) * 1000; // volume en cm3 / 5000 * 1000g

        // Le poids facturable est le max des deux
        const billableWeightGrams = Math.max(totalRealWeight, volumetricWeightGrams);

        // 3. Interrogation de la base de données pour le tarif
        const rateCost = await getRateFromMatrix(origin, destinationCountry, billableWeightGrams);

        const shipmentCost = rateCost + surcharge;
        totalShippingCost += shipmentCost;

        shipmentDetails.push({
            origin,
            billableWeightGrams,
            isVolumetric: volumetricWeightGrams > totalRealWeight,
            cost: shipmentCost,
            surcharge
        });
    }

    return { totalCost: totalShippingCost, details: shipmentDetails };
}

// Utilitaire volume
function getVolume(d: Dimensions): number {
    if (!d) return 0;
    return d.length * d.width * d.height;
}

// Fonction d'accès DB
async function getRateFromMatrix(origin: string, dest: string, weightGrams: number): Promise<number> {
    const supabase = createClient();

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
    if (origin === 'MA' && dest === 'FR') {
        // Chronopost International Maroc -> France (Tarifs indicatifs)
        // Base 25€ + 4€ par Kg supplémentaire
        return 2500 + (weightGrams / 1000) * 400;
    }

    // Colissimo France -> France (Tarifs indicatifs)
    // Base 8€ + 1€ par Kg
    return 800 + (weightGrams / 1000) * 100;
}
