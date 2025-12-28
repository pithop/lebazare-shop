'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { Plus, ShoppingBag, Loader2 } from 'lucide-react';
import QuickAddModal from './shop/QuickAddModal';

export default function ProductCard({ product }: { product: Product }) {
  const { handle, title, priceRange, images, category, variants } = product;
  const image = images.edges[0]?.node;
  const price = priceRange.minVariantPrice;

  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Logic to determine if we need a modal
  // If more than 1 variant, or if the single variant has a title other than "Default Title" (Shopify standard)
  const hasVariants = variants.edges.length > 1 || (variants.edges.length === 1 && variants.edges[0].node.title !== 'Default Title');

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    if (hasVariants) {
      setIsModalOpen(true);
    } else {
      // Direct Add
      setIsAdding(true);
      const variant = variants.edges[0]?.node;

      if (!variant) return;

      setTimeout(() => {
        addItem({
          id: variant.id,
          productId: product.id,
          title: title,
          price: parseFloat(price.amount),
          image: image?.url || '',
          quantity: 1,
          maxStock: 10
        });
        setIsAdding(false);
        toast.success('Ajouté au panier', {
          description: `${title} a été ajouté.`,
          icon: <ShoppingBag className="w-4 h-4 text-green-500" />
        });
      }, 500);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col h-full">
        <Link href={`/produits/${handle}`} className="block relative aspect-[3/4] overflow-hidden bg-stone-100 mb-4">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-50">
              <span className="font-serif italic">No Image</span>
            </div>
          )}

          {/* Quick Add Button - Desktop & Mobile */}
          <div className="absolute bottom-4 right-4 z-10">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-dark-text hover:bg-terracotta hover:text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              aria-label={hasVariants ? "Choisir les options" : "Ajouter au panier"}
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </button>
          </div>
        </Link>

        <div className="flex flex-col flex-grow">
          {category && (
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">{category}</p>
          )}
          <h3 className="text-lg font-serif text-dark-text mb-1 group-hover:text-terracotta transition-colors line-clamp-1">
            <Link href={`/produits/${handle}`}>
              {title}
            </Link>
          </h3>
          <div className="mt-auto flex items-center justify-between">
            <p className="text-stone-800 font-medium font-sans text-sm tracking-wide">
              {parseFloat(price.amount).toLocaleString('fr-FR', {
                style: 'currency',
                currency: price.currencyCode,
              })}
            </p>
          </div>
        </div>
      </div>

      <QuickAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
}
