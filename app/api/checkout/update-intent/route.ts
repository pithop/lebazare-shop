import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { calculateShipping, CartItem } from '@/utils/shippingCalculator';
import { createClient } from '@supabase/supabase-js';

// Initialisation Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover' as any,
    typescript: true
});

export async function POST(req: Request) {
    try {
        const { paymentIntentId, shippingAddress, items } = await req.json();

        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new Error("Panier vide ou invalide");
        }

        // 1. Initialisation Supabase Admin (Service Role) pour contourner RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 2. Récupération des données (Variants OU Produits)
        // Le frontend envoie des IDs qui peuvent être des IDs de variants OU des IDs de produits
        const targetIds = items.map((item: any) => item.id);

        // A. Chercher dans les variants (cas le plus fréquent pour un panier)
        const { data: variants, error: variantError } = await supabase
            .from('product_variants')
            .select('*, products(*)') // Join parent product
            .in('id', targetIds);

        if (variantError) {
            console.error("Erreur fetch variants:", variantError);
            throw new Error("Erreur lors de la récupération des variants");
        }

        // B. Chercher dans les produits (pour les produits simples sans variants ou si l'ID est un ID produit)
        const { data: products, error: productError } = await supabase
            .from('products')
            .select('*')
            .in('id', targetIds);

        if (productError) {
            console.error("Erreur fetch products:", productError);
            throw new Error("Erreur lors de la récupération des produits");
        }

        // 3. Construction du panier enrichi avec les données DB (Poids, Dims, Prix)
        // GRACEFUL FAIL: On filtre les produits qui n'existent plus
        const formattedItems = items
            .map((item: any) => {
                // Priorité 1: C'est un variant
                const variant = variants?.find(v => v.id === item.id);
                if (variant && variant.products) {
                    // @ts-ignore - Supabase typing for joined relation can be tricky
                    const parentProduct = variant.products;
                    return {
                        productId: parentProduct.id,
                        variantId: variant.id,
                        quantity: item.quantity,
                        weightGrams: parentProduct.weight_grams || 0,
                        dimensions: parentProduct.dimensions || { length: 0, width: 0, height: 0 },
                        originCountry: parentProduct.origin_country || 'MA',
                        isStackable: parentProduct.is_stackable || false,
                        price: variant.price, // Prix du VARIANT
                        handlingTier: parentProduct.handling_tier || 'standard'
                    };
                }

                // Priorité 2: C'est un produit direct
                const product = products?.find(p => p.id === item.id);
                if (product) {
                    return {
                        productId: product.id,
                        quantity: item.quantity,
                        weightGrams: product.weight_grams || 0,
                        dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
                        originCountry: product.origin_country || 'MA',
                        isStackable: product.is_stackable || false,
                        price: product.price, // Prix du PRODUIT
                        handlingTier: product.handling_tier || 'standard'
                    };
                }

                console.warn(`Produit/Variant ignoré (non trouvé en DB): ${item.id}`);
                return null;
            })
            .filter((item: any): item is CartItem => item !== null);

        if (formattedItems.length === 0) {
            throw new Error("Aucun produit valide dans le panier (Stock épuisé ou expiré). Veuillez vider votre panier.");
        }

        // 4. Exécution de l'algorithme de livraison
        let { totalCost: shippingCostCents } = await calculateShipping(
            formattedItems,
            shippingAddress.country
        );

        // FREE SHIPPING THRESHOLD (Dynamic)
        // Fetch shipping rules from settings
        const { data: shippingRulesData } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'shipping_rules')
            .single();

        const shippingRules = shippingRulesData?.value || { freeShippingThreshold: 100, isActive: true };
        const FREE_SHIPPING_THRESHOLD_CENTS = (shippingRules.isActive ? shippingRules.freeShippingThreshold : 999999) * 100;

        const productTotalCents = formattedItems.reduce((acc: number, item: any) => acc + (item.price * 100 * item.quantity), 0);

        if (productTotalCents >= FREE_SHIPPING_THRESHOLD_CENTS) {
            shippingCostCents = 0;
        }

        // 5. Calcul des Taxes (TVA incluse)
        // Le prix du produit inclut déjà la TVA (20%).
        // On calcule juste le montant de la TVA pour l'affichage (1/6 du prix TTC = 20% du HT)
        // Si shipping est payant, la TVA s'applique aussi dessus.

        let taxCents = 0;
        if (shippingAddress.country === 'FR') {
            // Montant TVA = (Total TTC / 1.2) * 0.2  => Total TTC / 6
            // On affiche la part de TVA contenue dans le total payé
            taxCents = Math.round((productTotalCents + shippingCostCents) / 6);
        }

        // LE TOTAL A PAYER EST JUSTE PRODUITS + LIVRAISON (TVA DEJA INCLUSE)
        const finalTotalAmount = Math.round(productTotalCents + shippingCostCents);

        // 6. Mise à jour atomique du PaymentIntent
        await stripe.paymentIntents.update(paymentIntentId, {
            amount: finalTotalAmount,
            currency: 'eur',
            shipping: {
                name: shippingAddress.name,
                address: {
                    line1: shippingAddress.line1,
                    city: shippingAddress.city,
                    country: shippingAddress.country,
                    postal_code: shippingAddress.postal_code,
                },
            },
            metadata: {
                shipping_cost_cents: shippingCostCents,
                tax_cents: taxCents, // Juste pour info
                calculation_status: 'finalized',
                // On stocke le breakdown pour l'admin
                logistics_breakdown: JSON.stringify({
                    items_count: formattedItems.length,
                    shipping_cost: shippingCostCents,
                    tax_included: taxCents,
                    free_shipping_applied: shippingCostCents === 0 && productTotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
                })
            }
        });

        return NextResponse.json({
            success: true,
            newAmount: finalTotalAmount,
            shippingCost: shippingCostCents,
            tax: taxCents
        });

    } catch (error: any) {
        console.error("Erreur Checkout:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
