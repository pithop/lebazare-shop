'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/lib/types';

interface AboutSectionProps {
    product?: Product;
}

export default function AboutSection({ product }: AboutSectionProps) {
    return (
        <section className="py-20 md:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2 relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden"
                    >
                        {product ? (
                            <Image
                                src={product.images.edges[0]?.node.url}
                                alt="Artisanat Marocain"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300">
                                Image non disponible
                            </div>
                        )}
                        {/* Decorative element */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-terracotta/10 rounded-full blur-3xl" />
                    </motion.div>

                    {/* Text Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2"
                    >
                        <span className="text-terracotta font-medium tracking-widest uppercase text-sm mb-4 block">
                            Notre Histoire
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-dark-text mb-6 leading-tight">
                            L'Art du Naturel & <br />
                            <span className="italic text-stone-400">de l'Authenticité</span>
                        </h2>
                        <div className="space-y-6 text-lg text-stone-600 font-light leading-relaxed">
                            <p>
                                LeBazare est née d'une passion profonde pour les matières naturelles et le savoir-faire ancestral des artisans marocains.
                            </p>
                            <p>
                                Chaque pièce de notre collection raconte une histoire unique. Tressée à la main, sculptée avec patience, elle porte en elle l'âme de son créateur et la chaleur de sa terre d'origine.
                            </p>
                            <p>
                                Nous croyons en une décoration qui a du sens, durable et respectueuse, qui apporte une touche de poésie bohème à votre intérieur.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
