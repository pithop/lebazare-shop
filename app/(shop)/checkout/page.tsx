'use client'

import { useCart } from '@/context/CartContext'
import { createOrder } from '@/actions/orders'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    if (items.length === 0 && !success) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-serif text-slate-900 mb-4">Votre panier est vide</h1>
                <Link href="/produits" className="text-terracotta hover:underline text-lg">
                    Retourner à la boutique
                </Link>
            </div>
        )
    }

    if (success) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h1 className="text-3xl font-serif text-slate-900 mb-4">Commande confirmée !</h1>
                <p className="text-slate-600 mb-8">Merci pour votre commande. Vous recevrez un email de confirmation bientôt.</p>
                <Link href="/produits" className="bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition-colors">
                    Continuer vos achats
                </Link>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const customerDetails = {
            email: formData.get('email'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            country: formData.get('country'),
        }

        const orderItems = items.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
        }))

        const result = await createOrder(customerDetails, orderItems, cartTotal)

        if (result.success) {
            setSuccess(true)
            clearCart()
        } else {
            setError(result.message || 'Une erreur est survenue.')
        }
        setLoading(false)
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-serif text-slate-900 mb-8 text-center">Finaliser la commande</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Formulaire */}
                <div>
                    <h2 className="text-xl font-medium mb-6">Informations de livraison</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-70"
                        >
                            {loading ? 'Traitement...' : `Payer ${cartTotal.toFixed(2)} €`}
                        </button>
                        <p className="text-xs text-center text-slate-500">Paiement sécurisé (Simulation)</p>
                    </form>
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
