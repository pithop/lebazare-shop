'use client'

import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQuantity, cartTotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-serif text-slate-900 mb-6">Votre panier est vide</h1>
        <p className="text-slate-600 mb-8 text-lg">Découvrez nos créations artisanales uniques.</p>
        <Link
          href="/produits"
          className="inline-block bg-terracotta text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Voir la boutique
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-slate-900 mb-12 text-center">Votre Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="relative w-24 h-24 bg-stone-50 rounded-lg overflow-hidden flex-shrink-0">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-lg text-slate-900">{item.title}</h3>
                  <p className="font-medium text-lg text-slate-900">{(item.price * item.quantity).toFixed(2)} €</p>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-slate-500 hover:bg-slate-50"
                    >
                      -
                    </button>
                    <span className="px-3 font-medium text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-slate-500 hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-red-500 hover:text-red-700 underline"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-stone-50 p-8 rounded-xl sticky top-24">
            <h2 className="text-xl font-serif text-slate-900 mb-6">Récapitulatif</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total</span>
                <span>{cartTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Livraison</span>
                <span className="text-slate-500 italic text-sm">Calculé à l'étape suivante</span>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-between text-xl font-medium text-slate-900">
                <span>Total</span>
                <span>{cartTotal.toFixed(2)} €</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-slate-900 text-white text-center py-4 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
            >
              Procéder au paiement
            </Link>

            <p className="text-xs text-center text-slate-500 mt-4">
              Paiement 100% sécurisé via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
