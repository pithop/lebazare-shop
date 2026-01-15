'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface StickyAddToCartProps {
    product: {
        id: string
        title: string
        images: Array<{ url: string }>
    }
    variantId: string
    price: number
    isAvailable: boolean
}

export default function StickyAddToCart({ product, variantId, price, isAvailable }: StickyAddToCartProps) {
    const [isVisible, setIsVisible] = useState(false)
    const { addItem } = useCart()

    useEffect(() => {
        const handleScroll = () => {
            // Show sticky button when scrolled past 600px (approx below hero)
            const shouldShow = window.scrollY > 600
            setIsVisible(shouldShow)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleAddToCart = () => {
        addItem({
            id: variantId,
            productId: product.id,
            title: product.title,
            price: price,
            image: product.images[0]?.url || '',
            quantity: 1,
            maxStock: 10
        })
        toast.success('Ajouté au panier !')
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-50 md:hidden"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-stone-100 flex-shrink-0">
                            <Image
                                src={product.images[0]?.url || ''}
                                alt={product.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-900 truncate">
                                {product.title}
                            </h4>
                            <p className="text-sm text-terracotta font-bold">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price)}
                            </p>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!isAvailable}
                            className="bg-slate-900 text-white px-6 py-3 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAvailable ? 'Ajouter' : 'Épuisé'}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
