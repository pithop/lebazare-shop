'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

const ETSY_API_KEY = process.env.ETSY_API_KEY
const ETSY_SHOP_ID = process.env.ETSY_SHOP_ID

export async function syncEtsyProducts() {
    if (!ETSY_API_KEY || !ETSY_SHOP_ID) {
        return { success: false, message: 'Missing Etsy API credentials' }
    }

    try {
        // 1. Fetch active listings from Etsy
        const response = await fetch(
            `https://openapi.etsy.com/v3/application/shops/${ETSY_SHOP_ID}/listings/active?limit=100`,
            {
                headers: {
                    'x-api-key': ETSY_API_KEY,
                },
            }
        )

        if (!response.ok) {
            const errorBody = await response.text()
            console.error('Etsy API Error Body:', errorBody)
            throw new Error(`Etsy API error: ${response.status} ${response.statusText} - ${errorBody}`)
        }

        const data = await response.json()
        const listings = data.results

        const supabase = createClient()
        let count = 0

        // 2. Process each listing
        for (const listing of listings) {
            // Fetch images for this listing
            // Note: In a real production scenario, we might want to batch this or handle rate limits carefully.
            // For v3, images are a separate endpoint usually, but let's check if 'includes' works or if we need a second call.
            // Standard v3 often requires separate calls or 'includes' param if supported.
            // For simplicity, we'll assume we might need to fetch images or they are in the listing object if expanded.
            // Let's do a basic fetch for images if needed, or just use the main image if available.

            // Actually, let's try to fetch images for the listing to get a nice array.
            const imagesResponse = await fetch(
                `https://openapi.etsy.com/v3/application/listings/${listing.listing_id}/images`,
                {
                    headers: {
                        'x-api-key': ETSY_API_KEY,
                    },
                }
            )

            let imageUrls: string[] = []
            if (imagesResponse.ok) {
                const imagesData = await imagesResponse.json()
                imageUrls = imagesData.results.map((img: any) => img.url_fullxfull)
            }

            // 3. Upsert into Supabase
            const { error } = await supabase
                .from('products')
                .upsert(
                    {
                        etsy_id: listing.listing_id.toString(),
                        title: listing.title,
                        description: listing.description,
                        price: listing.price.amount / listing.price.divisor, // Adjust based on Etsy price format
                        currency: listing.price.currency_code,
                        stock: listing.quantity,
                        images: imageUrls,
                        slug: listing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                        is_active: listing.state === 'active',
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'etsy_id' }
                )

            if (error) {
                console.error(`Error syncing listing ${listing.listing_id}:`, error)
            } else {
                count++
            }
        }

        revalidatePath('/admin/products')
        revalidatePath('/produits')

        return { success: true, message: `Synced ${count} products from Etsy` }
    } catch (error) {
        console.error('Etsy Sync Error:', error)
        return { success: false, message: 'Failed to sync products' }
    }
}
