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
        // Construct full order object
        // Parse customer_details if it's a string (handles potential legacy data or text column type)
        let customerDetails = order.customer_details;
        if (typeof customerDetails === 'string') {
            try {
                customerDetails = JSON.parse(customerDetails);
            } catch (e) {
                console.error('Failed to parse customer_details:', e);
            }
        }

        // Map flat DB structure to nested structure expected by components
        const shippingAddress = {
            line1: customerDetails.address || '',
            city: customerDetails.city || '',
            postal_code: customerDetails.postalCode || '',
            country: customerDetails.country || '',
        };

        const fullOrder = {
            ...order,
            customer_details: customerDetails, // Ensure we use the parsed object
            items: items,
            shipping_details: {
                address: shippingAddress
            }
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
            html: emailHtml, // CC handled globally in lib/email.ts
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

export async function sendOrderShipped(orderId: string, trackingNumber?: string, trackingUrl?: string, carrier?: string) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { success: false, message: 'Config error' };

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY);

    try {
        const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single();
        if (!order) return { success: false, message: 'Order not found' };

        // Parse customer details
        let customerDetails = order.customer_details;
        if (typeof customerDetails === 'string') {
            try { customerDetails = JSON.parse(customerDetails); } catch (e) { }
        }
        order.customer_details = customerDetails;

        const { renderToStaticMarkup } = await import('react-dom/server');
        const { OrderShipped } = await import('@/components/emails/OrderShipped');

        const emailHtml = renderToStaticMarkup(
            React.createElement(OrderShipped, { order, trackingNumber, trackingUrl, carrier })
        );

        await sendEmail({
            to: order.customer_details.email,
            subject: `Votre commande #${order.id.slice(0, 8)} est en route ! 🚚`,
            html: emailHtml,
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending shipped email:', error);
        return { success: false, message: 'Failed to send email' };
    }
}

export async function sendOrderCancelled(orderId: string, reason?: string) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { success: false, message: 'Config error' };

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY);

    try {
        const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single();
        if (!order) return { success: false, message: 'Order not found' };

        // Parse customer details
        let customerDetails = order.customer_details;
        if (typeof customerDetails === 'string') {
            try { customerDetails = JSON.parse(customerDetails); } catch (e) { }
        }
        order.customer_details = customerDetails;

        const { renderToStaticMarkup } = await import('react-dom/server');
        const { OrderCancelled } = await import('@/components/emails/OrderCancelled');

        const emailHtml = renderToStaticMarkup(
            React.createElement(OrderCancelled, { order, reason })
        );

        await sendEmail({
            to: order.customer_details.email,
            subject: `Annulation de votre commande #${order.id.slice(0, 8)}`,
            html: emailHtml,
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending cancelled email:', error);
        return { success: false, message: 'Failed to send email' };
    }
}

export async function sendWelcomeEmail(email: string, firstName: string) {
    try {
        const { renderToStaticMarkup } = await import('react-dom/server');
        const { WelcomeEmail } = await import('@/components/emails/WelcomeEmail');

        const emailHtml = renderToStaticMarkup(
            React.createElement(WelcomeEmail, { firstName })
        );

        await sendEmail({
            to: email,
            subject: `Bienvenue chez LeBazare ! ✨`,
            html: emailHtml,
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, message: 'Failed to send email' };
    }
}
