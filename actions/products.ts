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
    const imageFile = formData.get('image') as File | null

    let imageUrl = ''

    if (imageFile && imageFile.size > 0) {
        const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`
        const { data, error } = await supabase.storage
            .from('products')
            .upload(filename, imageFile, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Error uploading image:', error)
            // Continue without image or return error? Let's log and continue for now or return error.
            return { success: false, message: 'Failed to upload image' }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filename)

        imageUrl = publicUrl
    } else {
        // Check if it's a string URL (fallback for manual URL entry if we keep it)
        const imageString = formData.get('image') as string
        if (typeof imageString === 'string' && imageString.startsWith('http')) {
            imageUrl = imageString
        }
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { error } = await supabase.from('products').insert({
        title,
        description,
        price,
        stock,
        category,
        images: imageUrl ? [imageUrl] : [],
        slug,
        is_active: true,
    })

    if (error) {
        console.error('Error creating product:', error)
        return { success: false, message: 'Failed to create product' }
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

    if (imageFile && imageFile.size > 0) {
        const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`
        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filename, imageFile, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Error uploading image:', uploadError)
            return { success: false, message: 'Failed to upload image' }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filename)

        updates.images = [publicUrl]
    } else {
        // Check for manual URL fallback if provided and no file
        const imageString = formData.get('image_url') as string
        if (imageString && imageString.startsWith('http')) {
            updates.images = [imageString]
        }
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
