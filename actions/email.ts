'use server'

import { createClient } from '@supabase/supabase-js'
import React from 'react'
import { sendEmail } from '@/lib/email'

// Dynamic imports are used inside the function to avoid build issues with server-only modules
// import { renderToStream } from '@react-pdf/renderer'
// import { renderToStaticMarkup } from 'react-dom/server'
// import { OrderReceipt } from '@/components/emails/OrderReceipt'
// import { OrderInvoice } from '@/components/pdf/OrderInvoice'

export async function sendOrderConfirmation(orderId: string) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('SUPABASE_SERVICE_ROLE_KEY is missing')
        return { success: false, message: 'Configuration error' }
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    try {
        // 1. Fetch Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        if (orderError || !order) {
            console.error('Error fetching order:', orderError)
            return { success: false, message: 'Order not found' }
        }

        // 2. Fetch Order Items
        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId)

        if (itemsError) {
            console.error('Error fetching items:', itemsError)
            return { success: false, message: 'Items not found' }
        }

        // 3. Fetch Products
        const productIds = items.map((i: any) => i.product_id)
        const { data: products } = await supabase
            .from('products')
            .select('id, title, images')
            .in('id', productIds)

        // Construct full order object
        const fullOrder = {
            ...order,
            items: items,
            shipping_details: order.customer_details.shipping_details || order.customer_details // Handle structure
        }

        // 4. Generate PDF & Email HTML
        // Dynamically import libraries and components to prevent build errors
        const { renderToStream } = await import('@react-pdf/renderer');
        const { renderToStaticMarkup } = await import('react-dom/server');
        const { OrderInvoice } = await import('@/components/pdf/OrderInvoice');
        const { OrderReceipt } = await import('@/components/emails/OrderReceipt');

        const pdfStream = await renderToStream(
            React.createElement(OrderInvoice, { order: fullOrder, products: products || [] }) as any
        )

        // Convert stream to buffer
        const chunks: any[] = []
        for await (const chunk of pdfStream) {
            chunks.push(Buffer.from(chunk))
        }
        const pdfBuffer = Buffer.concat(chunks)

        // 5. Generate Email HTML
        const emailHtml = renderToStaticMarkup(
            React.createElement(OrderReceipt, { order: fullOrder, products: products || [] })
        )

        // 6. Send Email
        await sendEmail({
            to: order.customer_details.email,
            subject: `Confirmation de commande #${order.id.slice(0, 8)} - LeBazare`,
            html: emailHtml,
            cc: ['chahidriss01@gmail.com', 'hatimchah2@gmail.com'],
            attachments: [
                {
                    filename: `Facture-${order.id.slice(0, 8)}.pdf`,
                    content: pdfBuffer
                }
            ]
        })

        return { success: true }

    } catch (error) {
        console.error('Error sending confirmation:', error)
        return { success: false, message: 'Failed to send confirmation' }
    }
}
