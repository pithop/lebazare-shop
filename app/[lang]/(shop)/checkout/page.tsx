'use client'

import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '@/components/CheckoutForm'
import AddressAutocomplete from '@/components/AddressAutocomplete'
import { toast } from 'sonner'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
    const { items, cartTotal, removeItem } = useCart()
    const [clientSecret, setClientSecret] = useState('')
    const [paymentIntentId, setPaymentIntentId] = useState('')
    const [step, setStep] = useState<'details' | 'payment'>('details')
    const [customerDetails, setCustomerDetails] = useState<any>(null)

    // Shipping & Totals State
    const [shippingCost, setShippingCost] = useState<number | null>(null)
    const [tax, setTax] = useState<number>(0)
    const [totalAmount, setTotalAmount] = useState<number>(cartTotal)
    const [isCalculating, setIsCalculating] = useState(false)

    // Form State for Autocomplete
    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        postalCode: '',
        country: 'FR'
    })

    useEffect(() => {
        if (cartTotal > 0) {
            // Create PaymentIntent as soon as the page loads
            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: cartTotal }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setClientSecret(data.clientSecret)
                    setPaymentIntentId(data.paymentIntentId) // We need this ID to update it later
                })
        }
    }, [cartTotal])

    const handleAddressSelect = (address: any) => {
        setAddressForm(prev => ({
            ...prev,
            street: address.street,
            city: address.city,
            postalCode: address.postalCode,
            country: address.country
        }))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setAddressForm(prev => ({ ...prev, [name]: value }))
    }

    const calculateShipping = async () => {
        if (!paymentIntentId) return

        setIsCalculating(true)
        try {
            const response = await fetch('/api/checkout/update-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentIntentId,
                    shippingAddress: {
                        line1: addressForm.street,
                        city: addressForm.city,
                        postal_code: addressForm.postalCode,
                        country: addressForm.country,
                        name: "Customer" // Placeholder, will be updated with real name in final submit
                    },
                    items: items.map(item => ({ id: item.id, quantity: item.quantity }))
                }),
            })

            const data = await response.json()

            if (data.success) {
                setShippingCost(data.shippingCost / 100) // Convert cents to Euro
                setTax(data.tax / 100)
                setTotalAmount(data.newAmount / 100)
                return true
            } else {
                // Handle specific "Product not found" error
                if (data.error && data.error.includes("Produit introuvable")) {
                    const invalidId = data.error.split(': ')[1]?.trim();
                    if (invalidId) {
                        removeItem(invalidId);
                        toast.error("Un produit de votre panier n'est plus disponible et a été retiré.");
                        return false;
                    }
                }

                toast.error(data.error || "Erreur lors du calcul de la livraison")
                return false
            }
        } catch (error: any) {
            console.error("Error calculating shipping:", error)
            toast.error("Impossible de calculer les frais de port")
            return false
        } finally {
            setIsCalculating(false)
        }
    }

    const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget // Capture form before await

        // Calculate shipping before proceeding
        const success = await calculateShipping()
        if (!success) return

        const formData = new FormData(form)
        const details = {
            email: formData.get('email'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            address: addressForm.street,
            city: addressForm.city,
            postalCode: addressForm.postalCode,
            country: addressForm.country,
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

                                {/* Address Autocomplete Component */}
                                <AddressAutocomplete
                                    onSelect={handleAddressSelect}
                                    onChange={(val) => setAddressForm(prev => ({ ...prev, street: val }))}
                                    defaultValue={addressForm.street}
                                />

                                {/* Hidden input to ensure form validation works if user types manually in the autocomplete component (which updates state) */}
                                {/* Actually AddressAutocomplete handles the input UI. We just need to sync the other fields. */}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={addressForm.city}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Code Postal</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={addressForm.postalCode}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Pays</label>
                                    <select
                                        name="country"
                                        value={addressForm.country}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                                    >
                                        <option value="FR">France</option>
                                        <option value="BE">Belgique</option>
                                        <option value="CH">Suisse</option>
                                        <option value="DE">Allemagne</option>
                                        <option value="ES">Espagne</option>
                                        <option value="IT">Italie</option>
                                        <option value="NL">Pays-Bas</option>
                                        <option value="LU">Luxembourg</option>
                                        <option value="GB">Royaume-Uni</option>
                                        <option value="US">États-Unis</option>
                                        <option value="CA">Canada</option>
                                        <option value="AU">Australie</option>
                                        <option value="JP">Japon</option>
                                        <option value="MA">Maroc</option>
                                        <option value="PT">Portugal</option>
                                        <option value="IE">Irlande</option>
                                        <option value="SE">Suède</option>
                                        <option value="DK">Danemark</option>
                                        <option value="FI">Finlande</option>
                                        <option value="NO">Norvège</option>
                                        <option value="AT">Autriche</option>
                                        <option value="AE">Émirats arabes unis</option>
                                        <option value="SA">Arabie saoudite</option>
                                        <option value="QA">Qatar</option>
                                        <option value="KW">Koweït</option>
                                        {/* Add more as needed or use a library like country-list */}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isCalculating}
                                    className="w-full bg-slate-900 text-white py-4 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {isCalculating ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Calcul de la livraison...
                                        </>
                                    ) : (
                                        'Calculer la livraison & Continuer'
                                    )}
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
                                    <CheckoutForm
                                        customerDetails={customerDetails}
                                        clientSecret={clientSecret}
                                        amount={totalAmount}
                                        shippingCost={shippingCost || 0}
                                        tax={tax}
                                    />
                                </Elements>
                            )}
                        </>
                    )}
                </div>

                {/* Récapitulatif */}
                <div className="bg-stone-50 p-8 rounded-xl h-fit sticky top-24">
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
                            <span className={shippingCost === null ? "text-slate-400 italic" : "text-slate-900"}>
                                {shippingCost === null ? 'Calculé à l\'étape suivante' : `${shippingCost.toFixed(2)} €`}
                            </span>
                        </div>
                        {tax > 0 && (
                            <div className="flex justify-between text-slate-500 text-sm">
                                <span>Dont TVA (inclus)</span>
                                <span>{tax.toFixed(2)} €</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-medium text-slate-900 pt-2 border-t border-slate-200 mt-2">
                            <span>Total</span>
                            <span>{(shippingCost !== null ? totalAmount : cartTotal).toFixed(2)} €</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
