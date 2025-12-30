'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function getSetting(key: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .single()

    if (error) return null
    return data.value
}

export async function updateSetting(key: string, value: any) {
    const supabase = createClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, message: 'Non autorisé' }
    }

    const { error } = await supabase
        .from('settings')
        .upsert({ key, value })

    if (error) {
        console.error('Error updating setting:', error)
        return { success: false, message: 'Erreur lors de la mise à jour' }
    }

    revalidatePath('/')
    revalidatePath('/admin/settings')
    return { success: true }
}
