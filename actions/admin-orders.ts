'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, status: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) {
        console.error('Error updating order status:', error)
        return { success: false, message: 'Failed to update status' }
    }

    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
}

export async function updateOrderShipping(orderId: string, trackingNumber: string, carrier: string) {
    const supabase = createClient()

    // Note: You might need to add these columns to your orders table first!
    // For now, we'll store them in a 'shipping_details' jsonb column or just assume they exist if we migrate.
    // Let's check if we can add them or use a jsonb field. 
    // The current schema has 'customer_details' jsonb. 
    // Let's add 'shipping_info' jsonb column to orders table in a migration.

    const { error } = await supabase
        .from('orders')
        .update({
            shipping_info: {
                trackingNumber,
                carrier,
                shippedAt: new Date().toISOString()
            },
            status: 'shipped' // Auto update status to shipped? Maybe optional.
        })
        .eq('id', orderId)

    if (error) {
        console.error('Error updating shipping info:', error)
        return { success: false, message: 'Failed to update shipping info' }
    }

    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
}
