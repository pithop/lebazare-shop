import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover' as any,
    typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
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
            const { error } = await supabase
                .from('orders')
                .update({ status: 'paid' })
                .eq('id', orderId);

            if (error) {
                console.error('Error updating order status:', error);
                return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
            }
            console.log(`Order ${orderId} marked as paid.`);
        } else {
            console.warn('No orderId found in payment intent metadata');
        }
    }

    return NextResponse.json({ received: true });
}
