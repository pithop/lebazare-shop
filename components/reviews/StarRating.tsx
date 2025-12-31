'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
    rating: number
    max?: number
    size?: number
    interactive?: boolean
    onRate?: (rating: number) => void
}

export default function StarRating({ rating, max = 5, size = 20, interactive = false, onRate }: StarRatingProps) {
    return (
        <div className="flex gap-1">
            {[...Array(max)].map((_, i) => {
                const value = i + 1
                const isFilled = value <= rating

                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && onRate && onRate(value)}
                        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                    >
                        <Star
                            size={size}
                            className={`${isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-100 text-slate-200'}`}
                        />
                    </button>
                )
            })}
        </div>
    )
}
