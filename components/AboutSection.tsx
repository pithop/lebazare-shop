'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/lib/types';

interface AboutSectionProps {
    product?: Product;
}

export default function AboutSection({ product }: AboutSectionProps) {
    return (
        <section className="py-24 md:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
                    {/* Image Column - Minimalist */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="w-full md:w-1/2 relative h-[500px] md:h-[700px] bg-stone-50"
                    >
                        {product ? (
                            <Image
                                src={product.images.edges[0]?.node.url}
                                alt="Artisanat Marocain"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300 font-light">
                                Image indisponible
                            </div>
                        )}
                    </motion.div>

                    {/* Text Column - Clean Typography */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full md:w-1/2"
                    >
                        <h2 className="text-4xl md:text-6xl font-serif text-dark-text mb-8 leading-tight tracking-tight">
                            L'Essence du <br />
                            <span className="text-stone-400 italic">Fait Main</span>
                        </h2>
                        <div className="space-y-8 text-lg md:text-xl text-stone-600 font-light leading-relaxed">
                            <p>
                                Une célébration de la matière brute et du geste précis. LeBazare sélectionne des pièces qui racontent une histoire silencieuse mais puissante.
                            </p>
                            <p>
                                Du raphia tressé au bois sculpté, chaque objet est un témoin du temps et du savoir-faire ancestral, réinterprété pour l'intérieur contemporain.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
