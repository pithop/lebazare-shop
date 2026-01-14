'use client';

import { useState } from 'react';
import { Star, CheckCircle2, User, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewForm from './reviews/ReviewForm';

interface Review {
    id: string;
    author_name: string;
    rating: number;
    comment: string;
    created_at: string;
    is_verified: boolean;
}

interface ProductReviewsProps {
    reviews: Review[];
    averageRating: number;
    totalCount: number;
    ratingDistribution: Record<number, number>;
    productId: string; // Needed for the form
}

export default function ProductReviews({
    reviews,
    averageRating,
    totalCount,
    ratingDistribution,
    productId
}: ProductReviewsProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <section className="py-16 bg-white border-t border-stone-100" id="avis">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif text-slate-900 mb-4">Avis Clients</h2>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 ${star <= Math.round(averageRating)
                                        ? 'fill-terracotta text-terracotta'
                                        : 'fill-stone-100 text-stone-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-2xl font-light text-slate-900">{averageRating.toFixed(1)}</span>
                    </div>
                    <p className="text-slate-500">Basé sur {totalCount} avis</p>

                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="mt-6 px-6 py-2 border border-slate-900 text-slate-900 rounded-full hover:bg-slate-900 hover:text-white transition-colors duration-300 text-sm tracking-wide"
                    >
                        {isFormOpen ? 'Fermer le formulaire' : 'Écrire un avis'}
                    </button>
                </div>

                {/* Review Form - Expandable */}
                <AnimatePresence>
                    {isFormOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-12"
                        >
                            <div className="bg-stone-50 p-6 rounded-xl">
                                <ReviewForm productId={productId} onCancel={() => setIsFormOpen(false)} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Distribution Column */}
                    <div className="md:col-span-1 space-y-3">
                        <h3 className="font-medium text-slate-900 mb-4">Répartition</h3>
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = ratingDistribution[rating] || 0;
                            const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
                            return (
                                <div key={rating} className="flex items-center gap-3 text-sm">
                                    <div className="w-8 text-slate-600">{rating} ★</div>
                                    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-terracotta/80 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <div className="w-8 text-right text-slate-400 text-xs">{count}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Reviews List */}
                    <div className="md:col-span-2 space-y-8">
                        {reviews.length === 0 ? (
                            <div className="text-center py-12 bg-stone-50 rounded-xl">
                                <p className="text-slate-500 italic">Soyez le premier à donner votre avis sur cette pièce unique.</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="border-b border-stone-100 pb-8 last:border-0 hover:bg-stone-50/50 p-4 rounded-lg transition-colors overflow-hidden">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-slate-500">
                                                <User size={20} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 flex items-center gap-2">
                                                    {review.author_name}
                                                    {review.is_verified && (
                                                        <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                            <CheckCircle2 size={10} />
                                                            Achat vérifié
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {new Date(review.created_at).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={`${i < review.rating ? 'fill-terracotta text-terracotta' : 'fill-stone-200 text-stone-200'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        "{review.comment}"
                                    </p>
                                </div>
                            ))
                        )}

                        {totalCount > 5 && (
                            <button className="w-full py-3 text-sm text-terracotta border border-terracotta/20 rounded-lg hover:bg-terracotta/5 transition-colors">
                                Voir plus d'avis
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
