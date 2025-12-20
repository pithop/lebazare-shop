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
        <section className="relative py-32 overflow-hidden bg-stone-900 text-white">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                            Une Collection <br />
                            <span className="text-terracotta italic">Authentique</span>
                        </h2>
                        <p className="text-stone-400 text-lg font-light mb-8 max-w-md">
                            Découvrez nos dernières trouvailles, sélectionnées avec passion pour leur caractère unique et leur histoire.
                        </p>
                        <Link
                            href="/produits"
                            className="inline-block border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-full text-lg hover:bg-white hover:text-stone-900 transition-all duration-300"
                        >
                            Voir la Collection
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="md:w-1/2 relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden"
                    >
                        {product ? (
                            <Image
                                src={product.images.edges[0]?.node.url}
                                alt="Collection"
                                fill
                                className="object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full bg-stone-800" />
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
