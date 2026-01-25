'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, Suspense, useState } from 'react'
import { trackGoogleAdsPurchase } from '@/components/GoogleAdsTag'
import { trackPurchase } from '@/components/FacebookPixel'

function CheckoutSuccessContent() {
    const { clearCart } = useCart()
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const [tracked, setTracked] = useState(false)

    useEffect(() => {
        clearCart()

        // Track conversion only once
        if (orderId && !tracked) {
            // Fetch order details to get the amount
            const trackConversion = async () => {
                try {
                    const response = await fetch(`/api/orders/${orderId}`)
                    if (response.ok) {
                        const order = await response.json()
                        const totalAmount = order.total / 100 // Convert from cents to euros

                        // Track Google Ads conversion
                        trackGoogleAdsPurchase(orderId, totalAmount, 'EUR')

                        // Track Facebook conversion
                        trackPurchase(totalAmount, 'EUR')

                        setTracked(true)
                        console.log('Conversions tracked for order:', orderId, 'Amount:', totalAmount)
                    }
                } catch (error) {
                    console.error('Error tracking conversion:', error)
                }
            }
            trackConversion()
        }
    }, [clearCart, orderId, tracked])

    return (
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </div>

            <h1 className="text-4xl font-serif text-slate-900 mb-4">Paiement réussi !</h1>
            <p className="text-lg text-slate-600 mb-2">Merci pour votre commande.</p>
            {orderId && <p className="text-slate-500 mb-8">Numéro de commande : #{orderId.slice(0, 8)}</p>}

            <div className="flex justify-center gap-4">
                <Link
                    href="/produits"
                    className="bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    Continuer vos achats
                </Link>
            </div>
        </div>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <CheckoutSuccessContent />
        </Suspense>
    )
}
