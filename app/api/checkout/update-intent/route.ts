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

        // 2. Récupération des VRAIS produits depuis la DB (Source de Vérité)
        // On ne fait confiance qu'aux IDs et Quantités envoyés par le client
        const productIds = items.map((item: any) => item.id);
        const { data: dbProducts, error } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds);

        if (error || !dbProducts) {
            throw new Error("Erreur lors de la récupération des produits");
        }

        // 3. Construction du panier enrichi avec les données DB (Poids, Dims, Prix)
        // GRACEFUL FAIL: On filtre les produits qui n'existent plus (ex: vieux panier)
        const formattedItems = items
            .map((item: any) => {
                const dbProduct = dbProducts.find(p => p.id === item.id);
                if (!dbProduct) {
                    console.warn(`Produit ignoré (non trouvé en DB): ${item.id}`);
                    return null;
                }

                return {
                    productId: dbProduct.id,
                    quantity: item.quantity,
                    weightGrams: dbProduct.weight_grams || 0,
                    dimensions: dbProduct.dimensions || { length: 0, width: 0, height: 0 },
                    originCountry: dbProduct.origin_country || 'MA',
                    isStackable: dbProduct.is_stackable || false,
                    price: dbProduct.price, // Prix DB !
                    handlingTier: dbProduct.handling_tier || 'standard'
                };
            })
            .filter((item: any): item is CartItem => item !== null); // On garde uniquement les produits valides

        if (formattedItems.length === 0) {
            throw new Error("Aucun produit valide dans le panier (Stock épuisé ou expiré). Veuillez vider votre panier.");
        }

        // 4. Exécution de l'algorithme de livraison
        const { totalCost: shippingCostCents } = await calculateShipping(
            formattedItems,
            shippingAddress.country
        );

        // 5. Calcul des Taxes (Règle IOSS simplifiée)
        // TVA 20% si destination FR et montant < 150€
        const productTotalCents = formattedItems.reduce((acc: number, item: any) => acc + (item.price * 100 * item.quantity), 0);

        let taxCents = 0;
        if (shippingAddress.country === 'FR') {
            // En théorie IOSS < 150€. Ici on simplifie : TVA toujours collectée pour FR
            taxCents = Math.round((productTotalCents + shippingCostCents) * 0.20);
        }

        const finalTotalAmount = Math.round(productTotalCents + shippingCostCents + taxCents);

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
                tax_cents: taxCents,
                calculation_status: 'finalized',
                // On stocke le breakdown pour l'admin
                logistics_breakdown: JSON.stringify({
                    items_count: formattedItems.length,
                    shipping_cost: shippingCostCents,
                    tax: taxCents
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
