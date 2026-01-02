'use server'

import { createClient } from '@/lib/supabase-server'
// import productsData from '../lebazare.json' // Disabled: File moved to dump

export async function seedProducts() {
    // This function is disabled because the source JSON file has been moved.
    // To re-enable, restore lebazare.json or update the path.
    console.warn('seedProducts is disabled.')
    return { success: false, count: 0, errors: 0, message: 'Seeding disabled' }

    /*
    const supabase = createClient()
    let count = 0
    let errors = 0

    // The JSON structure is a bit nested: [ { itemListElement: [ { item: Product } ] } ]
    // We need to extract the items.
    const items = productsData[0].itemListElement.map((el: any) => el.item)

    for (const item of items) {
        try {
            const title = item.name
            const description = item.name // JSON doesn't have separate description, using title for now
            const price = parseFloat(item.offers.price)
            const imageUrl = item.image
            const etsyUrl = item.url
            // Extract ID from URL for etsy_id (e.g., listing/1902123371/...)
            const etsyIdMatch = etsyUrl.match(/listing\/(\d+)/)
            const etsyId = etsyIdMatch ? etsyIdMatch[1] : null

            // Determine category based on title keywords (simple heuristic)
            let category = 'Autre'
            const lowerTitle = title.toLowerCase()
            if (lowerTitle.includes('bag') || lowerTitle.includes('tote') || lowerTitle.includes('sac')) category = 'Sacs'
            else if (lowerTitle.includes('stool') || lowerTitle.includes('tabouret')) category = 'Mobilier'
            else if (lowerTitle.includes('light') || lowerTitle.includes('lamp') || lowerTitle.includes('sconce')) category = 'Luminaires'
            else if (lowerTitle.includes('basket') || lowerTitle.includes('trunk') || lowerTitle.includes('panier')) category = 'Rangement'
            else if (lowerTitle.includes('fabric') || lowerTitle.includes('tissu')) category = 'Tissus'

            const slug = title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
                // Add random suffix to ensure uniqueness if titles are same
                + '-' + Math.random().toString(36).substring(2, 7)

            const { error } = await supabase
                .from('products')
                .upsert({
                    title,
                    description,
                    price,
                    images: [imageUrl],
                    stock: 10, // Default stock
                    slug,
                    etsy_id: etsyId,
                    category,
                    is_active: true
                }, { onConflict: 'etsy_id' })

            if (error) {
                console.error(`Error importing ${title}:`, error)
                errors++
            } else {
                count++
            }
        } catch (err) {
            console.error('Error processing item:', err)
            errors++
        }
    }

    return { success: true, count, errors }
    */
}
