import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

export async function POST(req: Request) {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Stripe keys missing' }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-11-17.clover' as any,
        typescript: true,
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const supabase = createClient();

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
            // 1. Idempotent update: Only proceed if status was NOT 'paid'
            // We use .select() to get the updated row. If no row is returned, it means the condition (neq 'paid') failed,
            // so the order was already paid.
            const { data: updatedOrder, error: updateError } = await supabase
                .from('orders')
                .update({ status: 'paid' })
                .eq('id', orderId)
                .neq('status', 'paid')
                .select()
                .single();

            if (updateError && updateError.code !== 'PGRST116') { // PGRST116 is "JSON object requested, multiple (or no) rows returned" - which is expected if already paid
                console.error('Error updating order status:', updateError);
                return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
            }

            if (!updatedOrder) {
                console.log(`Order ${orderId} was already processed (idempotency check).`);
                return NextResponse.json({ received: true });
            }

            console.log(`Order ${orderId} marked as paid. Decrementing stock...`);

            // 2. Fetch items to decrement stock
            const { data: orderItems, error: itemsError } = await supabase
                .from('order_items')
                .select('product_id, variant_id, quantity')
                .eq('order_id', orderId);

            if (itemsError) {
                console.error('Error fetching order items:', itemsError);
                // We don't fail the webhook here because the order is already paid. 
                // We should probably log this to Sentry or similar.
            } else if (orderItems) {
                for (const item of orderItems) {
                    const targetId = item.variant_id || item.product_id;
                    if (targetId) {
                        const { error: rpcError } = await supabase.rpc('decrement_stock', {
                            variant_id: targetId,
                            quantity_to_subtract: item.quantity
                        });

                        if (rpcError) {
                            console.error(`Failed to decrement stock for item ${targetId}:`, rpcError);
                        }
                    }
                }
            }
        } else {
            console.warn('No orderId found in payment intent metadata');
        }
    }

    return NextResponse.json({ received: true });
}
