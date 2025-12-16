'use server'

import { createClient } from '@supabase/supabase-js'

export async function createOrder(customerDetails: any, items: any[], total: number) {
    // Use Service Role Key to bypass RLS for order creation (allows guest checkout)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            total,
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

    return { success: true, orderId: order.id }
}
