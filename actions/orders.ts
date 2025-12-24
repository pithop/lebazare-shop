'use server'

import { createClient } from '@supabase/supabase-js'
import React from 'react'

export async function createOrder(customerDetails: any, items: any[], total: number, shippingTotalCents: number = 0, taxTotalCents: number = 0) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('SUPABASE_SERVICE_ROLE_KEY is missing')
        return { success: false, message: 'Configuration error: Service Role Key missing' }
    }

    // Use Service Role Key to bypass RLS for order creation (allows guest checkout)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            total,
            shipping_total_cents: shippingTotalCents,
            tax_total_cents: taxTotalCents,
            status: 'pending', // In a real app, this would be 'pending_payment' then 'paid'
            customer_details: customerDetails
        })
        .select()
        .single()

    if (orderError) {
        console.error('Error creating order:', orderError)
        return { success: false, message: `Failed to create order: ${orderError.message}` }
    }

    // 2. Create Order Items
    const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id || null, // Optional
        quantity: item.quantity,
        price: item.price
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) {
        console.error('Error creating order items:', itemsError)
        // Ideally we should rollback the order here, but for simplicity we'll just log it
        return { success: false, message: 'Failed to create order items' }
    }

    // 3. Send Email
    try {
        // Fetch product details for the email
        const productIds = items.map(i => i.product_id);
        const { data: products } = await supabase
            .from('products')
            .select('id, title, images')
            .in('id', productIds);

        // Construct full order object for the template
        // We ensure shipping_details is present (it's part of customerDetails in our schema)
        const fullOrder = {
            ...order,
            items: orderItems,
            shipping_details: customerDetails.shipping_details || customerDetails // Handle potential structure diffs
        };

        const { renderToStaticMarkup } = await import('react-dom/server');
        const { OrderReceipt } = await import('@/components/emails/OrderReceipt');
        const { sendEmail } = await import('@/lib/email');

        const emailHtml = renderToStaticMarkup(
            React.createElement(OrderReceipt, { order: fullOrder, products: products || [] })
        );

        await sendEmail({
            to: customerDetails.email,
            subject: `Confirmation de commande #${order.id.slice(0, 8)} - LeBazare`,
            html: emailHtml,
            cc: ['chahidriss01@gmail.com', 'hatimchah2@gmail.com']
        });

    } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the order if email fails
    }

    return { success: true, orderId: order.id }
}
