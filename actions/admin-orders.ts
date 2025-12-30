'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { sendOrderShipped, sendOrderCancelled } from '@/actions/email'

export async function updateOrderStatus(orderId: string, status: string, reason?: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) {
        console.error('Error updating order status:', error)
        return { success: false, message: 'Failed to update status' }
    }

    // Trigger Emails based on status change
    if (status === 'shipped') {
        // Try to fetch shipping info if available, otherwise send without tracking
        const { data: order } = await supabase.from('orders').select('shipping_info').eq('id', orderId).single();
        const shippingInfo = order?.shipping_info || {};
        await sendOrderShipped(orderId, shippingInfo.trackingNumber, undefined, shippingInfo.carrier);
    } else if (status === 'cancelled') {
        await sendOrderCancelled(orderId, reason);
    }

    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
}

export async function updateOrderShipping(orderId: string, trackingNumber: string, carrier: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('orders')
        .update({
            shipping_info: {
                trackingNumber,
                carrier,
                shippedAt: new Date().toISOString()
            },
            status: 'shipped' // Auto update status to shipped
        })
        .eq('id', orderId)

    if (error) {
        console.error('Error updating shipping info:', error)
        return { success: false, message: 'Failed to update shipping info' }
    }

    // Trigger Shipped Email with tracking info
    // We construct a tracking URL if possible, or leave it undefined
    let trackingUrl = undefined;
    if (carrier.toLowerCase().includes('la poste') || carrier.toLowerCase().includes('colissimo')) {
        trackingUrl = `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`;
    } else if (carrier.toLowerCase().includes('mondial relay')) {
        trackingUrl = `https://www.mondialrelay.fr/suivi-de-colis?numeroExpedition=${trackingNumber}&codePostal=`; // Needs postal code usually
    }

    await sendOrderShipped(orderId, trackingNumber, trackingUrl, carrier);

    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
}
