'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/types';

interface HeroCarouselProps {
    products: Product[];
}

export default function HeroCarousel({ products }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [products.length]);

    const currentProduct = products[currentIndex];

    if (!currentProduct) return null;

    return (
        <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-beige">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentProduct.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    {/* Split Layout */}
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Left: Text Content */}
                        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16 z-10 bg-beige/90 md:bg-beige order-2 md:order-1 h-1/2 md:h-full">
                            <div className="max-w-xl text-center md:text-left">
                                <motion.span
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-block text-terracotta font-medium tracking-widest uppercase text-xs md:text-sm mb-2 md:mb-4"
                                >
                                    Tendance Artisanale
                                </motion.span>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl md:text-6xl lg:text-7xl font-serif text-dark-text mb-3 md:mb-6 leading-tight"
                                >
                                    {currentProduct.title}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-sm md:text-lg text-slate-600 mb-4 md:mb-8 line-clamp-2 md:line-clamp-3 leading-relaxed font-light"
                                >
                                    {currentProduct.description}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Link
                                        href={`/produits/${currentProduct.handle}`}
                                        className="inline-flex items-center gap-2 bg-dark-text text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-lg font-medium hover:bg-terracotta transition-colors shadow-lg group"
                                    >
                                        Découvrir la Pièce
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                        </svg>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>

                        {/* Right: Image */}
                        <div className="w-full md:w-1/2 relative h-1/2 md:h-full order-1 md:order-2">
                            <div className="absolute inset-0 bg-black/5 z-10" /> {/* Subtle overlay */}
                            {currentProduct.images.edges[0] && (
                                <Image
                                    src={currentProduct.images.edges[0].node.url}
                                    alt={currentProduct.images.edges[0].node.altText || currentProduct.title}
                                    fill
                                    className="object-cover object-center"
                                    priority
                                    quality={95}
                                />
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 md:left-1/4 -translate-x-1/2 z-20 flex gap-3">
                {products.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-terracotta w-8' : 'bg-slate-300 hover:bg-slate-400'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
