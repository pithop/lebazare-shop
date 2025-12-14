'use client';

import { useState } from 'react';

interface AddToCartButtonProps {
  variantId: string;
  productTitle: string;
}

export default function AddToCartButton({ variantId, productTitle }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = () => {
    // For now, since we don't have a Supabase cart yet and Shopify is removed,
    // we redirect to the cart page which explains the Etsy flow.
    window.location.href = '/panier';
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
