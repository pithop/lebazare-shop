'use client'

import { useCart } from '@/context/CartContext'

export default function CartIcon() {
    const { cartCount, setIsCartOpen } = useCart()

    return (
        <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-dark-text hover:text-terracotta transition-colors relative"
            aria-label="Panier"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5c.07.286.074.58.012.865-.187.872-1.169 1.343-1.964.938-.47-.237-.853-.66-1.09-1.164a5.99 5.99 0 01-1.932 0C13.93 13.893 14.26 13.5 14.26 13.5h-4.52s.33 1.393-.146 2.646c-.237.504-.62.927-1.09 1.164-.795.405-1.777-.066-1.964-.938a2.53 2.53 0 01.012-.865l1.263-5M9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm7.5 0c0 .414-.168.75-.375.75S16.5 10.164 16.5 9.75s.168-.75.375-.75.375.336.375.75z" />
            </svg>
            {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-terracotta text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                </span>
            )}
        </button>
    )
}
