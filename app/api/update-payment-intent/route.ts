import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: 'Stripe Secret Key missing' }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-11-17.clover' as any,
        typescript: true,
    });

    try {
        const { paymentIntentId, orderId } = await request.json();

        if (!paymentIntentId || !orderId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await stripe.paymentIntents.update(paymentIntentId, {
            metadata: {
                orderId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Internal Error:', error);
        return NextResponse.json(
            { error: `Internal Server Error: ${error.message}` },
            { status: 500 }
        );
    }
}
