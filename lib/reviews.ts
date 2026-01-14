import { createClient } from '@/lib/supabase-server'

export interface Review {
    id: string
    product_id: string
    rating: number
    comment: string
    author_name: string
    author_email: string | null
    is_verified: boolean
    status: string
    created_at: string
    product?: {
        id: string
        title: string
        slug: string
        images: string[]
        handle: string
    }
}

/**
 * Get top-rated reviews for homepage showcase
 */
export async function getTopReviews(limit: number = 12): Promise<Review[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('reviews')
        .select(`
            *,
            product:products(id, title, slug, images)
        `)
        .eq('status', 'published')
        .gte('rating', 4) // Only 4 and 5 star reviews
        .order('rating', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching top reviews:', error)
        return []
    }

    return data as Review[]
}

/**
 * Get reviews for a specific product
 */
export async function getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 5
): Promise<{ reviews: Review[], total: number }> {
    const supabase = await createClient()

    const offset = (page - 1) * limit

    // Get reviews with pagination
    const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    // Get total count
    const { count, error: countError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', productId)
        .eq('status', 'published')

    if (reviewsError || countError) {
        console.error('Error fetching product reviews:', reviewsError || countError)
        return { reviews: [], total: 0 }
    }

    return {
        reviews: reviews as Review[],
        total: count || 0
    }
}

/**
 * Calculate average rating for a product
 */
export async function getAverageRating(productId: string | null = null): Promise<number> {
    const supabase = await createClient()

    let query = supabase
        .from('reviews')
        .select('rating')
        .eq('status', 'published')

    if (productId) {
        query = query.eq('product_id', productId)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
        return 0
    }

    const sum = data.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0)
    return Number((sum / data.length).toFixed(1))
}

/**
 * Get rating distribution for a product
 */
export async function getRatingDistribution(productId: string): Promise<Record<number, number>> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId)
        .eq('status', 'published')

    if (error || !data) {
        return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    data.forEach((review: { rating: number }) => {
        distribution[review.rating] = (distribution[review.rating] || 0) + 1
    })

    return distribution
}

/**
 * Get total review count
 */
export async function getTotalReviewCount(productId: string | null = null): Promise<number> {
    const supabase = await createClient()

    let query = supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

    if (productId) {
        query = query.eq('product_id', productId)
    }

    const { count, error } = await query

    if (error) {
        console.error('Error getting review count:', error)
        return 0
    }

    return count || 0
}
