'use client'

import { useState } from 'react'
import { subscribeToNewsletter } from '@/actions/newsletter'
import { toast } from 'sonner'

export default function NewsletterForm() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        const result = await subscribeToNewsletter(formData)
        setIsLoading(false)

        if (result.success) {
            toast.success(result.message)
            // Reset form
            const form = document.getElementById('newsletter-form') as HTMLFormElement
            form?.reset()
        } else {
            toast.error(result.message)
        }
    }

    return (
        <form id="newsletter-form" action={handleSubmit} className="flex flex-col space-y-3">
            <div className="relative">
                <input
                    name="email"
                    type="email"
                    placeholder="Votre email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-sand focus:bg-white/10 transition-all"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="bg-sand text-deep-blue px-6 py-3 rounded-lg hover:bg-white transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Inscription...' : "S'inscrire"}
            </button>
        </form>
    )
}
