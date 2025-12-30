'use server'

import { sendWelcomeEmail } from '@/actions/email'

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get('email') as string

    if (!email) {
        return { success: false, message: 'Email requis' }
    }

    // Here you would typically save to a database or external service (Mailchimp, etc.)
    // For now, we just send the welcome email.

    // Extract name from email for personalization (e.g. john.doe@example.com -> John)
    const name = email.split('@')[0].split('.')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    const result = await sendWelcomeEmail(email, formattedName);

    if (result.success) {
        return { success: true, message: 'Inscription réussie !' }
    } else {
        return { success: false, message: 'Erreur lors de l\'inscription' }
    }
}
