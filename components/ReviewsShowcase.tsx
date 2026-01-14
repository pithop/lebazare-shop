'use client';

import { useRef, useState } from 'react';
import { Star, Quote, ArrowUpRight } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Review {
    id: string;
    author_name: string;
    rating: number;
    comment: string;
    created_at?: string;
    product?: {
        title: string;
        slug: string;
        images?: string[];
    };
}

interface ReviewsShowcaseProps {
    reviews: Review[];
    averageRating: number;
    totalCount: number;
}

export default function ReviewsShowcase({ reviews, averageRating, totalCount }: ReviewsShowcaseProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Decode HTML entities helper (SSR-safe)
    const decode = (str: string) => {
        if (!str) return '';
        return str
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&nbsp;/g, ' ');
    };

    return (
        <section ref={ref} className="py-24 bg-[#FDFBF7] relative overflow-hidden">
            {/* Background Texture/Gradient for Depth */}
            <div className="absolute inset-0 opacity-40 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 200, 180, 0.1) 0%, transparent 60%)' }} />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/50 border border-stone-100 backdrop-blur-sm shadow-sm"
                    >
                        <div className="flex text-terracotta">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={12} className="fill-current" />
                            ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 tracking-wider uppercase">
                            Excellence ({averageRating}/5)
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-900 mb-8 leading-[1.1]"
                    >
                        La Collection des <br /><span className="italic text-terracotta font-light">Expériences Uniques</span>
                    </motion.h2>
                </div>

                {/* Interactive Masonry Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 px-2 md:px-0">
                    {reviews.slice(0, 9).map((review, idx) => (
                        <ReviewCard key={review.id} review={review} idx={idx} decode={decode} isInView={isInView} />
                    ))}
                </div>

                {/* View More Button - Minimalist */}
                <div className="text-center mt-20">
                    {totalCount > 9 && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.8 }}
                            className="group inline-flex items-center gap-2 px-8 py-3 bg-transparent border border-slate-900 rounded-full text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-500 text-sm tracking-widest uppercase hover:px-10"
                        >
                            Découvrir les {totalCount} avis
                            <ArrowUpRight size={16} />
                        </motion.button>
                    )}
                </div>
            </div>
        </section>
    );
}

function ReviewCard({ review, idx, decode, isInView }: { review: Review, idx: number, decode: (s: string) => string, isInView: boolean }) {
    const [isHovered, setIsHovered] = useState(false);

    // Get product image safely (first image from string array)
    let productImage = null;
    if (review.product?.images && Array.isArray(review.product.images) && review.product.images.length > 0) {
        // Sometimes images might be stored as JSON string in DB but returned as array by Supabase if defined correctly, 
        // or we might need to parse. Given previous code, assume it's iterable.
        // If it's a string, we parse it.
        const imgs = typeof review.product.images === 'string' ? JSON.parse(review.product.images) : review.product.images;
        if (imgs.length > 0) productImage = imgs[0];
    }

    const CardContent = (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: idx * 0.1, ease: "easeOut" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="break-inside-avoid relative bg-white p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-stone-50 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out cursor-pointer group overflow-hidden transform-gpu"
        >
            {/* Hover Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br from-terracotta/5 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

            <div className="relative z-10">
                {/* Header: Stars & Quote */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                className={`${i < review.rating ? 'fill-terracotta text-terracotta' : 'fill-stone-100 text-stone-100'}`}
                            />
                        ))}
                    </div>
                    <Quote className="w-8 h-8 text-stone-100 group-hover:text-terracotta/20 transition-colors duration-500" />
                </div>

                {/* Review Text */}
                <p className="text-slate-600 font-serif text-[1.05rem] leading-[1.8] mb-8 line-clamp-6 group-hover:text-slate-900 transition-colors duration-300">
                    "{decode(review.comment)}"
                </p>

                {/* Footer: Author & Product */}
                <div className="flex items-center justify-between pt-6 border-t border-stone-100/50 group-hover:border-terracotta/10 transition-colors duration-500">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FDFBF7] flex items-center justify-center text-terracotta font-serif font-bold text-sm border border-stone-100">
                            {review.author_name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">{decode(review.author_name)}</div>
                            {review.product && (
                                <div className="text-xs text-slate-400 group-hover:text-terracotta transition-colors duration-300 truncate max-w-[120px]">
                                    {review.product.title}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Thumbnail Reveal */}
                    <AnimatePresence>
                        {isHovered && productImage && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: 10 }}
                                transition={{ duration: 0.3 }}
                                className="w-12 h-12 rounded-lg overflow-hidden border border-white shadow-lg relative bg-stone-100"
                            >
                                <Image
                                    src={productImage}
                                    alt="Product"
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );

    // If product exists, wrap in link
    if (review.product) {
        return (
            <Link href={`/${review.product.slug ? `produits/${review.product.slug}` : '#'}`} className="block">
                {CardContent}
            </Link>
        );
    }

    return CardContent;
}
