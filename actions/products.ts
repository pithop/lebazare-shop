'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
    const supabase = createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const seo_title = formData.get('seo_title') as string
    const title_en = formData.get('title_en') as string
    const description_en = formData.get('description_en') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const category = formData.get('category') as string
    const videoUrl = formData.get('video_url') as string
    const videoFile = formData.get('video_file') as File | null
    let finalVideoUrl = videoUrl

    if (videoFile && videoFile.size > 0) {
        const filename = `video-${Date.now()}-${Math.random().toString(36).substring(7)}-${videoFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`
        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filename, videoFile, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Error uploading video:', uploadError)
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filename)
            finalVideoUrl = publicUrl
        }
    }

    const imageFiles = formData.getAll('new_images') as File[]
    const imageUrls: string[] = []

    for (const imageFile of imageFiles) {
        if (imageFile && imageFile.size > 0) {
            const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`
            const { data, error } = await supabase.storage
                .from('products')
                .upload(filename, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) {
                console.error('Error uploading image:', error)
                continue
            }

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filename)

            imageUrls.push(publicUrl)
        }
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { data: product, error } = await supabase.from('products').insert({
        title,
        description,
        seo_title: seo_title || null,
        title_en: title_en || null,
        description_en: description_en || null,
        price,
        stock,
        category,
        images: imageUrls,
        video_url: finalVideoUrl || null,
        slug,
        is_active: true,
    }).select().single()

    if (error) {
        console.error('Error creating product:', error)
        return { success: false, message: 'Failed to create product' }
    }

    // Handle Variants
    const variantsJson = formData.get('variants') as string
    if (variantsJson) {
        try {
            const variants = JSON.parse(variantsJson)
            if (Array.isArray(variants) && variants.length > 0) {
                const variantsToInsert = variants.map((v: any) => ({
                    product_id: product.id,
                    name: v.name,
                    price: v.price || null, // If 0 or null, it might use product price logic in frontend
                    stock: v.stock,
                    attributes: v.attributes
                }))

                const { error: variantsError } = await supabase
                    .from('product_variants')
                    .insert(variantsToInsert)

                if (variantsError) {
                    console.error('Error creating variants:', variantsError)
                    // Don't fail the whole request, but log it
                }
            }
        } catch (e) {
            console.error('Error parsing variants JSON:', e)
        }
    }

    revalidatePath('/admin/products')
    revalidatePath('/produits')
    redirect('/admin/products')
}

export async function deleteProduct(id: string) {
    const supabase = createClient()

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
        console.error('Error deleting product:', error)
        return { success: false, message: 'Failed to delete product' }
    }

    revalidatePath('/admin/products')
    revalidatePath('/produits')
    return { success: true, message: 'Product deleted' }
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const seo_title = formData.get('seo_title') as string
    const title_en = formData.get('title_en') as string
    const description_en = formData.get('description_en') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const category = formData.get('category') as string
    const imageFile = formData.get('image') as File | null

    if (isNaN(price)) {
        return { success: false, message: 'Invalid price' }
    }
    if (isNaN(stock)) {
        return { success: false, message: 'Invalid stock' }
    }

    const videoUrl = formData.get('video_url') as string
    const videoFile = formData.get('video_file') as File | null
    let finalVideoUrl = videoUrl

    if (videoFile && videoFile.size > 0) {
        const filename = `video-${Date.now()}-${Math.random().toString(36).substring(7)}-${videoFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`
        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filename, videoFile, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Error uploading video:', uploadError)
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filename)
            finalVideoUrl = publicUrl
        }
    }

    const updates: any = {
        title,
        description,
        seo_title: seo_title || null,
        title_en: title_en || null,
        description_en: description_en || null,
        price,
        stock,
        category,
        video_url: finalVideoUrl || null,
        updated_at: new Date().toISOString(),
    }

    const imageFiles = formData.getAll('new_images') as File[]
    const newImageUrls: string[] = []

    for (const imageFile of imageFiles) {
        if (imageFile && imageFile.size > 0) {
            const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filename, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                console.error('Error uploading image:', uploadError)
                continue
            }

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filename)

            newImageUrls.push(publicUrl)
        }
    }

    // Handle Images
    // 1. Get kept images (from JSON) - This preserves the order sent by frontend
    const keptImagesJson = formData.get('kept_images') as string
    let finalImages: string[] = []

    if (keptImagesJson) {
        try {
            finalImages = JSON.parse(keptImagesJson)
        } catch (e) {
            console.error('Error parsing kept_images:', e)
        }
    } else {
        const { data: currentProduct } = await supabase.from('products').select('images').eq('id', id).single()
        finalImages = currentProduct?.images || []
    }

    // 2. Append new uploads
    if (newImageUrls.length > 0) {
        finalImages = [...finalImages, ...newImageUrls]
    }

    updates.images = finalImages

    const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)

    if (error) {
        console.error('Error updating product:', error)
        return { success: false, message: `Failed to update product: ${error.message}` }
    }

    // Handle Variants
    const variantsJson = formData.get('variants') as string
    if (variantsJson) {
        try {
            const variants = JSON.parse(variantsJson)
            if (Array.isArray(variants)) {
                // 1. Get existing variants
                const { data: existingVariants, error: fetchError } = await supabase
                    .from('product_variants')
                    .select('id')
                    .eq('product_id', id)

                if (fetchError) {
                    console.error('Error fetching existing variants:', fetchError)
                }

                const existingIds = existingVariants?.map(v => v.id) || []
                const incomingIds = variants.filter((v: any) => v.id).map((v: any) => v.id)

                // 2. Delete removed variants
                const idsToDelete = existingIds.filter(id => !incomingIds.includes(id))
                if (idsToDelete.length > 0) {
                    await supabase.from('product_variants').delete().in('id', idsToDelete)
                }

                // 3. Upsert (Update existing + Insert new)
                const variantsToUpsert = variants.map((v: any) => ({
                    id: v.id, // If present, it updates. If not, it's ignored by upsert? No, upsert needs ID to match.
                    // Actually, for new items, we shouldn't pass ID if we want auto-gen. 
                    // But Supabase upsert works by matching Primary Key.
                    // If v.id is present, it matches. If not, we need to NOT pass it so it generates.
                    // OR we can separate Insert and Update.
                    product_id: id,
                    name: v.name,
                    price: v.price || null,
                    stock: v.stock,
                    attributes: v.attributes
                }))

                // Separate Insert and Update for clarity and safety
                const toInsert = variantsToUpsert
                    .filter((v: any) => !v.id)
                    .map(({ id, ...rest }: any) => rest) // Remove undefined id to allow DB default to trigger

                const toUpdate = variantsToUpsert.filter((v: any) => v.id)

                if (toInsert.length > 0) {
                    const { error: insertError } = await supabase.from('product_variants').insert(toInsert)
                    if (insertError) console.error('Error inserting variants:', insertError)
                }

                if (toUpdate.length > 0) {
                    // Upsert handles updates if ID matches
                    const { error: updateError } = await supabase.from('product_variants').upsert(toUpdate)
                    if (updateError) console.error('Error updating variants:', updateError)
                }
            }
        } catch (e) {
            console.error('Error updating variants:', e)
        }
    }

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    revalidatePath('/produits')

    return { success: true, message: 'Product updated successfully' }
}
