'use server'

import { createClient } from '@supabase/supabase-js'
import { getOrCreateCustomerCode } from '@/lib/customer-codes'

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

    // Get or create customer code for this email
    let customerCode: string | null = null;
    try {
        if (customerDetails?.email) {
            customerCode = await getOrCreateCustomerCode(customerDetails.email);
        }
    } catch (error) {
        console.error('Error generating customer code:', error);
        // Continue without code if generation fails
    }

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            total,
            shipping_total_cents: shippingTotalCents,
            tax_total_cents: taxTotalCents,
            status: 'pending', // In a real app, this would be 'pending_payment' then 'paid'
            customer_details: customerDetails,
            customer_code: customerCode // New field
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
    // Email is now sent post-payment in actions/email.ts

    return { success: true, orderId: order.id, customerCode }
}

