'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import QuickAddModal from './shop/QuickAddModal';

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { handle, title, priceRange, images, category, variants } = product;
  const image = images.edges[0]?.node;
  const price = priceRange.minVariantPrice;

  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasVariants = variants.edges.length > 1 || (variants.edges.length === 1 && variants.edges[0].node.title !== 'Default Title');

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasVariants) {
      setIsModalOpen(true);
    } else {
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
          style: { background: '#F9F5F0', color: '#1A1A1A', border: '1px solid #E5E7EB' }
        });
      }, 500);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="group relative w-full mb-12 break-inside-avoid"
      >
        <Link href={`/produits/${handle}`} className="block relative w-full overflow-hidden bg-stone-100 cursor-none-custom">
          {/* Image Container with Parallax-like Effect on Hover */}
          <div className="relative w-full aspect-[3/4] overflow-hidden">
            {image ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full h-full relative"
              >
                <Image
                  src={image.url}
                  alt={image.altText || title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-50">
                <span className="font-serif italic text-lg">No Image</span>
              </div>
            )}

            {/* Artistic Overlay - Minimal */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

            {/* Quick Add Trigger - Floating Circle */}
            <motion.button
              onClick={handleQuickAdd}
              disabled={isAdding}
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-6 right-6 w-12 h-12 bg-white text-dark-text rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-6 h-6 stroke-[1.5]" />
              )}
            </motion.button>
          </div>

          {/* Info Section - Clean & Typography Focused */}
          <div className="pt-4 px-1">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                {category && (
                  <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                    {category}
                  </p>
                )}
                <h3 className="text-xl font-serif text-dark-text leading-tight group-hover:text-terracotta transition-colors duration-300">
                  {title}
                </h3>
              </div>
              <p className="text-sm font-medium text-dark-text font-sans pt-1">
                {parseFloat(price.amount).toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: price.currencyCode,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>
        </Link>
      </motion.div>

      <QuickAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
}
