'use client'

import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function CartDrawer() {
    const { items, removeItem, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart()
    const drawerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                setIsCartOpen(false)
            }
        }

        if (isCartOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isCartOpen, setIsCartOpen])

    if (!isCartOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
            <div
                ref={drawerRef}
                className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right"
            >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-stone-50">
                    <h2 className="text-2xl font-serif text-slate-900">Votre Panier</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-slate-400 hover:text-slate-600 p-2"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 mb-4">Votre panier est vide.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-terracotta hover:underline"
                            >
                                Continuer vos achats
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="relative w-20 h-20 bg-stone-50 rounded-lg overflow-hidden flex-shrink-0 border border-stone-100">
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-slate-900 line-clamp-2 mb-1">{item.title}</h3>
                                    <p className="text-slate-500 text-sm mb-2">{item.price.toFixed(2)} €</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border border-slate-200 rounded-md">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-2 py-1 text-slate-500 hover:bg-slate-50"
                                            >
                                                -
                                            </button>
                                            <span className="px-2 text-sm font-medium text-slate-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-2 py-1 text-slate-500 hover:bg-slate-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-xs text-red-500 hover:text-red-700 underline"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-slate-100 bg-stone-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-600">Sous-total</span>
                            <span className="text-xl font-medium text-slate-900">{cartTotal.toFixed(2)} €</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-6 text-center">
                            Frais de port calculés à l'étape suivante.
                        </p>
                        <Link
                            href="/checkout"
                            onClick={() => setIsCartOpen(false)}
                            className="block w-full bg-slate-900 text-white text-center py-4 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                        >
                            Procéder au paiement
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
