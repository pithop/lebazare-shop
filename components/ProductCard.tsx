'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import QuickAddModal from './shop/QuickAddModal';

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { handle, title, priceRange, images, category, variants } = product;
  const image = images.edges[0]?.node;
  const price = priceRange.minVariantPrice;

  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasVariants = variants.edges.length > 1 || (variants.edges.length === 1 && variants.edges[0].node.title !== 'Default Title');

  // Magnetic Effect Logic
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const center = { x: left + width / 2, y: top + height / 2 };
    const distance = { x: clientX - center.x, y: clientY - center.y };

    // Subtle movement (divide by larger number for subtlety)
    x.set(distance.x / 20);
    y.set(distance.y / 20);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const transform = useMotionTemplate`translate3d(${mouseX}px, ${mouseY}px, 0)`;

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
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative w-full mb-16 break-inside-avoid"
      >
        <Link href={`/produits/${handle}`} className="block relative w-full cursor-none-custom">
          {/* Image Container */}
          <motion.div
            style={{ transform }}
            className="relative w-full aspect-[3/4] overflow-hidden bg-stone-100"
          >
            {image ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
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

            {/* Quick Add Trigger - Minimal Text on Hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none">
              <span className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-medium tracking-widest uppercase border border-white/20">
                {hasVariants ? 'Choisir' : 'Ajouter'}
              </span>
            </div>

            {/* Actual Clickable Button (Invisible but functional over the whole area or specific corner) 
                For this design, let's keep the specific button for clarity but styled minimally 
            */}
            <motion.button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="absolute bottom-4 right-4 w-10 h-10 bg-white text-dark-text rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-terracotta hover:text-white"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-5 h-5 stroke-[1.5]" />
              )}
            </motion.button>
          </motion.div>

          {/* Info Section - Minimal & Spaced */}
          <div className="pt-6 flex flex-col items-center text-center">
            {category && (
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-2">
                {category}
              </p>
            )}
            <h3 className="text-2xl font-serif text-dark-text leading-none mb-2 group-hover:text-terracotta transition-colors duration-500">
              {title}
            </h3>
            <p className="text-sm font-medium text-stone-500 font-sans">
              {parseFloat(price.amount).toLocaleString('fr-FR', {
                style: 'currency',
                currency: price.currencyCode,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
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
