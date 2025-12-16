'use client'

import { useState, useEffect } from 'react'
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/actions/orders'

export default function CheckoutForm({ customerDetails, clientSecret }: { customerDetails: any, clientSecret: string }) {
    const stripe = useStripe()
    const elements = useElements()
    const { items, cartTotal, clearCart } = useCart()

    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!stripe) {
            return
        }

        if (!clientSecret) {
            return
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case 'succeeded':
                    setMessage('Paiement réussi !')
                    break
                case 'processing':
                    setMessage('Votre paiement est en cours de traitement.')
                    break
                case 'requires_payment_method':
                    setMessage('Votre paiement a échoué, veuillez réessayer.')
                    break
                default:
                    // Only show error if we are redirected back with an error or if status is explicitly failed
                    // Initial load usually has 'requires_payment_method' which is fine
                    break
            }
        })
    }, [stripe, clientSecret])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsLoading(true)
        setMessage(null)

        try {
            // 1. Create Order in Supabase (Pending)
            const orderItems = items.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }))

            const orderResult = await createOrder(customerDetails, orderItems, cartTotal)

            if (!orderResult.success) {
                throw new Error(orderResult.message || 'Erreur lors de la création de la commande.')
            }

            // 2. Update PaymentIntent with Order ID
            const updateResult = await fetch('/api/update-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentIntentId: (await stripe.retrievePaymentIntent(clientSecret)).paymentIntent?.id,
                    orderId: orderResult.orderId
                }),
            })

            if (!updateResult.ok) {
                console.error('Failed to update payment intent metadata')
                // We continue anyway as the order is created, but it's not ideal
            }

            // 3. Confirm Payment
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout/success?orderId=${orderResult.orderId}`,
                },
            })

            if (error) {
                if (error.type === 'card_error' || error.type === 'validation_error') {
                    throw new Error(error.message || 'Une erreur est survenue')
                } else {
                    throw new Error('Une erreur inattendue est survenue.')
                }
            }
        } catch (err: any) {
            console.error('Checkout error:', err)
            setMessage(err.message || 'Une erreur est survenue lors du paiement.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Traitement...</div> : `Payer ${cartTotal.toFixed(2)} €`}
                </span>
            </button>

            {message && <div id="payment-message" className="text-red-600 text-sm text-center">{message}</div>}
        </form>
    )
}
