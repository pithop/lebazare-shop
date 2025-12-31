'use server'

import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: FormData) {
    const supabase = createClient()
    const adminClient = createAdminClient() // Use admin client to check orders securely

    const productId = formData.get('productId') as string
    const rating = parseInt(formData.get('rating') as string)
    const comment = formData.get('comment') as string
    const authorName = formData.get('authorName') as string
    const authorEmail = formData.get('authorEmail') as string

    if (!productId || !rating || !authorName || !authorEmail) {
        return { success: false, message: 'Tous les champs sont requis' }
    }

    // 1. Check for verification (Has this email bought this product?)
    // We need to check the orders table. Since customer_details is JSONB, we query inside it.
    // And we check order_items for the product_id.

    // Note: This query might be heavy if not indexed properly on JSONB, but for now it's fine.
    // We look for orders with this email that contain the product.
    const { data: orders } = await adminClient
        .from('orders')
        .select(`
            id,
            customer_details,
            order_items!inner(product_id)
        `)
        .eq('order_items.product_id', productId)
        .filter('customer_details->>email', 'eq', authorEmail)
        .limit(1)

    const isVerified = orders && orders.length > 0

    // 2. Insert Review
    const { error } = await supabase
        .from('reviews')
        .insert({
            product_id: productId,
            rating,
            comment,
            author_name: authorName,
            author_email: authorEmail,
            is_verified: isVerified,
            status: 'published' // Auto-publish for now
        })

    if (error) {
        console.error('Error submitting review:', error)
        return { success: false, message: 'Erreur lors de l\'envoi de l\'avis' }
    }

    revalidatePath(`/produits/${productId}`) // Revalidate product page
    return { success: true, isVerified }
}

export async function getProductReviews(productId: string) {
    const supabase = createClient()

    const { data: reviews, error } = await supabase
        .from('reviews')
        .select('id, rating, comment, author_name, is_verified, created_at')
        .eq('product_id', productId)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching reviews:', error)
        return []
    }

    return reviews
}
