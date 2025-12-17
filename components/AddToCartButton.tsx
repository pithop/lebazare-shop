'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  variantId: string
  productId: string
  productTitle: string
  price: number
  image: string
}

export default function AddToCartButton({ variantId, productId, productTitle, price, image }: AddToCartButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    setIsPending(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      addItem({
        id: variantId,
        productId: productId,
        title: productTitle,
        price: price,
        image: image,
        quantity: 1,
        maxStock: 10 // Default max stock for now
      })
      setIsPending(false)
      toast.success('Produit ajouté au panier', {
        description: `${productTitle} a été ajouté à votre panier.`,
        action: {
          label: 'Voir le panier',
          onClick: () => document.querySelector('button[aria-label="Open cart"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true })),
        },
      })
    }, 500)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending}
      className="w-full bg-slate-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isPending ? (
        <>
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Ajout...
        </>
      ) : (
        'Ajouter au panier'
      )}
    </button>
  )
}
