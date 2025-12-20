'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';

interface CTASectionProps {
    product?: Product;
}

export default function CTASection({ product }: CTASectionProps) {
    return (
        <section className="relative py-32 md:py-48 overflow-hidden flex items-center justify-center">
            {/* Background Image with Parallax-like fixed position or absolute */}
            <div className="absolute inset-0 z-0">
                {product ? (
                    <Image
                        src={product.images.edges[0]?.node.url}
                        alt="Background"
                        fill
                        className="object-cover brightness-[0.3]"
                    />
                ) : (
                    <div className="w-full h-full bg-stone-900" />
                )}
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 md:mb-8 leading-tight">
                        Créez un Intérieur <br />
                        <span className="text-terracotta italic">Qui Vous Ressemble</span>
                    </h2>
                    <p className="text-lg md:text-xl text-stone-200 mb-10 max-w-2xl mx-auto font-light">
                        Laissez-vous inspirer par nos collections uniques et apportez une touche d'authenticité à votre quotidien.
                    </p>
                    <Link
                        href="/produits"
                        className="inline-block bg-white text-dark-text px-8 py-4 md:px-10 md:py-5 rounded-full text-lg font-medium hover:bg-terracotta hover:text-white transition-all duration-300 shadow-lg hover:shadow-terracotta/50 hover:-translate-y-1"
                    >
                        Explorer la Collection
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
