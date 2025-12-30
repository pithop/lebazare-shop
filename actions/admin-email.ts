'use server'

import { sendOrderConfirmation } from '@/actions/email'
import { createClient } from '@/lib/supabase-server'

export async function resendOrderConfirmation(orderId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: 'Non autorisé' }
    }

    try {
        const result = await sendOrderConfirmation(orderId)
        return result
    } catch (error) {
        console.error('Error resending email:', error)
        return { success: false, message: 'Erreur lors de l\'envoi' }
    }
}
