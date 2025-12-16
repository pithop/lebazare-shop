'use client'

import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '@/components/CheckoutForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
    const { items, cartTotal } = useCart()
    const [clientSecret, setClientSecret] = useState('')
    const [step, setStep] = useState<'details' | 'payment'>('details')
    const [customerDetails, setCustomerDetails] = useState<any>(null)

    useEffect(() => {
        if (cartTotal > 0) {
            // Create PaymentIntent as soon as the page loads
            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: cartTotal }),
            })
                .then((res) => res.json())
                .then((data) => setClientSecret(data.clientSecret))
        }
    }, [cartTotal])

    const handleDetailsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const details = {
            email: formData.get('email'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            country: formData.get('country'),
        }
        setCustomerDetails(details)
        setStep('payment')
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-serif text-slate-900 mb-4">Votre panier est vide</h1>
                <Link href="/produits" className="text-terracotta hover:underline text-lg">
                    Retourner à la boutique
                </Link>
            </div>
        )
    }

    const appearance = {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#0f172a',
        },
    }
    const options = {
        clientSecret,
        appearance,
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-serif text-slate-900 mb-8 text-center">Finaliser la commande</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Formulaire */}
                <div>
                    {step === 'details' ? (
                        <>
                            <h2 className="text-xl font-medium mb-6">1. Informations de livraison</h2>
                            <form onSubmit={handleDetailsSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input type="email" name="email" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                                        <input type="text" name="firstName" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                                        <input type="text" name="lastName" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                                    <input type="text" name="address" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
                                        <input type="text" name="city" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Code Postal</label>
                                        <input type="text" name="postalCode" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Pays</label>
                                    <select name="country" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none">
                                        <option value="FR">France</option>
                                        <option value="BE">Belgique</option>
                                        <option value="CH">Suisse</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-slate-900 text-white py-4 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                                >
                                    Continuer vers le paiement
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-medium">2. Paiement</h2>
                                <button
                                    onClick={() => setStep('details')}
                                    className="text-sm text-slate-500 hover:text-slate-900 underline"
                                >
                                    Modifier la livraison
                                </button>
                            </div>

                            {clientSecret && (
                                <Elements options={options} stripe={stripePromise}>
                                    <CheckoutForm customerDetails={customerDetails} />
                                </Elements>
                            )}
                        </>
                    )}
                </div>

                {/* Récapitulatif */}
                <div className="bg-stone-50 p-8 rounded-xl h-fit">
                    <h2 className="text-xl font-medium mb-6">Récapitulatif</h2>
                    <div className="space-y-4 mb-6">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="relative w-16 h-16 bg-white rounded-md overflow-hidden border border-slate-200">
                                    {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-slate-900 line-clamp-2">{item.title}</p>
                                    <p className="text-slate-500 text-sm">Qté: {item.quantity}</p>
                                </div>
                                <p className="font-medium text-slate-900">{(item.price * item.quantity).toFixed(2)} €</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-200 pt-4 space-y-2">
                        <div className="flex justify-between text-slate-600">
                            <span>Sous-total</span>
                            <span>{cartTotal.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Livraison</span>
                            <span>Gratuit</span>
                        </div>
                        <div className="flex justify-between text-lg font-medium text-slate-900 pt-2 border-t border-slate-200 mt-2">
                            <span>Total</span>
                            <span>{cartTotal.toFixed(2)} €</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
