'use client';

import { useState } from 'react';

interface AddToCartButtonProps {
  variantId: string;
  productTitle: string;
}

export default function AddToCartButton({ variantId, productTitle }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    setIsAdding(true);
    setMessage('');

    try {
      // Get or create cart
      let cartId = localStorage.getItem('cartId');

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId,
          variantId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout au panier');
      }

      const data = await response.json();
      
      // Save cart ID
      if (data.cart?.id) {
        localStorage.setItem('cartId', data.cart.id);
      }

      setMessage(`${productTitle} ajouté au panier !`);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage('Erreur lors de l\'ajout au panier');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full bg-accent-red text-white px-8 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdding ? 'Ajout en cours...' : 'Ajouter au panier'}
      </button>
      
      {message && (
        <p className={`text-center text-sm ${message.includes('Erreur') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
