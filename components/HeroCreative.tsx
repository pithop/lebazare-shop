'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';

interface HeroCreativeProps {
    products: Product[];
}

export default function HeroCreative({ products }: HeroCreativeProps) {
    if (!products || products.length < 3) return null;

    const mainProduct = products[0];
    const secondaryProduct = products[1];
    const tertiaryProduct = products[2];

    return (
        <section className="relative min-h-[90vh] bg-stone-50 overflow-hidden">
            <div className="container mx-auto px-4 py-4 md:py-8 h-full flex flex-col lg:flex-row gap-4 md:gap-6">

                {/* Left Column: Main Feature */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:w-2/3 relative h-[50vh] md:h-[60vh] lg:h-[85vh] rounded-2xl md:rounded-3xl overflow-hidden group"
                >
                    <Image
                        src={mainProduct.images.edges[0]?.node.url}
                        alt={mainProduct.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white w-full">
                        <span className="inline-block px-3 py-1 mb-3 md:mb-4 text-[10px] md:text-xs font-medium tracking-widest uppercase bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                            Tendance
                        </span>
                        <h2 className="text-2xl md:text-5xl font-serif mb-3 md:mb-4 leading-tight max-w-2xl drop-shadow-lg">
                            {mainProduct.title}
                        </h2>
                        <Link
                            href={`/produits/${mainProduct.handle}`}
                            className="inline-flex items-center gap-2 text-base md:text-lg font-medium hover:text-terracotta transition-colors"
                        >
                            Découvrir
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                        </Link>
                    </div>
                </motion.div>

                {/* Right Column: Grid & Content */}
                <div className="lg:w-1/3 flex flex-col gap-4 md:gap-6 h-full">

                    {/* Top Right: Secondary Product */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative h-[25vh] md:h-[30vh] lg:h-[40vh] rounded-2xl md:rounded-3xl overflow-hidden group"
                    >
                        <Image
                            src={secondaryProduct.images.edges[0]?.node.url}
                            alt={secondaryProduct.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white">
                            <h3 className="text-lg md:text-xl font-serif mb-1 md:mb-2 line-clamp-1">{secondaryProduct.title}</h3>
                            <Link href={`/produits/${secondaryProduct.handle}`} className="text-xs md:text-sm underline decoration-1 underline-offset-4 hover:text-terracotta transition-colors">
                                Voir le produit
                            </Link>
                        </div>
                    </motion.div>

                    {/* Bottom Right: Content Block */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex-1 bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col justify-center items-start shadow-sm border border-stone-100 min-h-[200px]"
                    >
                        <h3 className="text-xl md:text-2xl font-serif text-dark-text mb-3 md:mb-4">
                            Artisanat Authentique
                        </h3>
                        <p className="text-sm md:text-base text-stone-600 mb-4 md:mb-6 leading-relaxed">
                            Découvrez notre nouvelle collection de pièces uniques, faites à la main avec passion.
                        </p>
                        <Link
                            href="/produits"
                            className="w-full py-3 md:py-4 rounded-xl border border-stone-200 text-center text-sm md:text-base font-medium text-dark-text hover:bg-stone-900 hover:text-white transition-all"
                        >
                            Tout le catalogue
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
