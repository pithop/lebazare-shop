import StarRating from './StarRating'
import { CheckCircle2 } from 'lucide-react'

interface Review {
    id: string
    rating: number
    comment: string
    author_name: string
    is_verified: boolean
    created_at: string
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500 italic">
                Aucun avis pour le moment. Soyez le premier à donner votre avis !
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-slate-100 pb-8 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">{review.author_name}</span>
                            {review.is_verified && (
                                <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                    <CheckCircle2 size={12} />
                                    Achat Vérifié
                                </span>
                            )}
                        </div>
                        <span className="text-sm text-slate-400">
                            {new Date(review.created_at).toLocaleDateString('fr-FR')}
                        </span>
                    </div>
                    <div className="mb-2">
                        <StarRating rating={review.rating} size={16} />
                    </div>
                    <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                </div>
            ))}
        </div>
    )
}
