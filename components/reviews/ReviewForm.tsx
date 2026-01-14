'use client'

import { useState } from 'react'
import { submitReview } from '@/actions/reviews'
import StarRating from './StarRating'
import { toast } from 'sonner'

export default function ReviewForm({ productId, onCancel }: { productId: string, onCancel?: () => void }) {
    const [rating, setRating] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        if (rating === 0) {
            toast.error('Veuillez sélectionner une note')
            return
        }

        setIsSubmitting(true)
        formData.append('productId', productId)
        formData.append('rating', rating.toString())

        const result = await submitReview(formData)

        if (result.success) {
            toast.success('Merci pour votre avis !')
            // Reset form (optional, or redirect)
            setRating(0)
            // Ideally we'd reset the form fields too, but standard form submission handles this if we don't preventDefault manually for everything
        } else {
            toast.error(result.message)
        }
        setIsSubmitting(false)
    }

    return (
        <form action={handleSubmit} className="bg-stone-50 p-6 rounded-xl border border-stone-100">
            <h3 className="text-lg font-serif text-slate-900 mb-4">Donnez votre avis</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Votre note</label>
                    <StarRating rating={rating} interactive onRate={setRating} size={24} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                        <input type="text" name="authorName" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" placeholder="Votre prénom" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" name="authorEmail" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" placeholder="Pour vérifier votre achat" />
                        <p className="text-xs text-slate-500 mt-1">Votre email ne sera pas publié.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Commentaire</label>
                    <textarea name="comment" rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" placeholder="Qu'avez-vous pensé de ce produit ?"></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 w-full md:w-auto"
                >
                    {isSubmitting ? 'Envoi...' : 'Publier mon avis'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="bg-transparent text-slate-500 px-6 py-2 rounded-lg hover:text-slate-800 transition-colors w-full md:w-auto mt-2 md:mt-0 md:ml-2"
                    >
                        Annuler
                    </button>
                )}
            </div>
        </form>
    )
}
