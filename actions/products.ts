'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
    const supabase = createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const category = formData.get('category') as string
    const imageFiles = formData.getAll('image') as File[]
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

    // Fallback for manual URL entry (if we keep it)
    const imageString = formData.get('image_url') as string
    if (imageString && imageString.startsWith('http')) {
        imageUrls.push(imageString)
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { data: product, error } = await supabase.from('products').insert({
        title,
        description,
        price,
        stock,
        category,
        images: imageUrls,
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
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const category = formData.get('category') as string
    const imageFile = formData.get('image') as File | null

    const updates: any = {
        title,
        description,
        price,
        stock,
        category,
        updated_at: new Date().toISOString(),
    }

    const imageFiles = formData.getAll('image') as File[]
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

    // Check for manual URL fallback if provided
    const imageString = formData.get('image_url') as string
    if (imageString && imageString.startsWith('http')) {
        newImageUrls.push(imageString)
    }

    if (newImageUrls.length > 0) {
        // Fetch existing images to append or replace? 
        // Usually update replaces or appends. Let's append for now or maybe just replace if user uploaded new ones?
        // The user said "add multiple photos", implying adding to existing or creating new set.
        // For simplicity in this form, if new images are uploaded, we might want to keep old ones or replace.
        // Let's fetch current product to append.
        const { data: currentProduct } = await supabase.from('products').select('images').eq('id', id).single()
        const currentImages = currentProduct?.images || []
        updates.images = [...currentImages, ...newImageUrls]
    }

    const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)

    if (error) {
        console.error('Error updating product:', error)
        return { success: false, message: 'Failed to update product' }
    }

    revalidatePath('/admin/products')
    revalidatePath('/produits')
    redirect('/admin/products')
}
