'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { X, Check, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export default function QuickAddModal({ isOpen, onClose, product }: QuickAddModalProps) {
    const { addItem } = useCart();
    const [selectedVariantId, setSelectedVariantId] = useState<string>('');
    const [isAdding, setIsAdding] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen && product.variants.edges.length > 0) {
            // Default to first available variant
            const firstAvailable = product.variants.edges.find(e => e.node.availableForSale);
            if (firstAvailable) {
                setSelectedVariantId(firstAvailable.node.id);
            }
        }
    }, [isOpen, product]);

    const handleAddToCart = () => {
        if (!selectedVariantId) return;

        setIsAdding(true);
        const variant = product.variants.edges.find(e => e.node.id === selectedVariantId)?.node;

        if (!variant) return;

        // Simulate network delay for UX
        setTimeout(() => {
            addItem({
                id: variant.id,
                productId: product.id,
                title: `${product.title} - ${variant.title}`,
                price: parseFloat(variant.priceV2.amount),
                image: product.images.edges[0]?.node.url || '',
                quantity: 1,
                maxStock: 10 // Placeholder
            });

            setIsAdding(false);
            onClose();
            toast.success('Ajouté au panier', {
                description: `${product.title} (${variant.title}) a été ajouté.`,
                icon: <Check className="w-4 h-4 text-green-500" />
            });
        }, 600);
    };

    // Extract options from variants (simplified for now, assuming flat variants or single option)
    // In a real Shopify setup, we'd parse options (Color, Size). 
    // For this implementation, we'll list variants directly if they are simple, or try to group them.
    // Given the current type definition, we just have a list of variants.

    const selectedVariant = product.variants.edges.find(e => e.node.id === selectedVariantId)?.node;
    const price = selectedVariant ? parseFloat(selectedVariant.priceV2.amount) : parseFloat(product.priceRange.minVariantPrice.amount);
    const currency = selectedVariant ? selectedVariant.priceV2.currencyCode : product.priceRange.minVariantPrice.currencyCode;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative"
                        >
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 p-2 text-stone-400 hover:text-dark-text transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-6">
                                <div className="flex gap-4 mb-6">
                                    <div className="relative w-24 h-32 flex-shrink-0 bg-stone-100 rounded-lg overflow-hidden">
                                        {product.images.edges[0] && (
                                            <Image
                                                src={product.images.edges[0].node.url}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl text-dark-text mb-1">{product.title}</h3>
                                        <p className="text-terracotta font-medium text-lg">
                                            {price.toLocaleString('fr-FR', { style: 'currency', currency })}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <label className="block text-sm font-medium text-stone-600">
                                        Choisir une option
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {product.variants.edges.map(({ node: variant }) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariantId(variant.id)}
                                                disabled={!variant.availableForSale}
                                                className={`px-4 py-3 text-sm border rounded-lg transition-all text-left flex justify-between items-center ${selectedVariantId === variant.id
                                                        ? 'border-terracotta bg-terracotta/5 text-terracotta ring-1 ring-terracotta'
                                                        : 'border-stone-200 text-dark-text hover:border-stone-300'
                                                    } ${!variant.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <span>{variant.title}</span>
                                                {selectedVariantId === variant.id && <Check className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={!selectedVariantId || isAdding}
                                    className="w-full bg-dark-text text-white py-4 rounded-lg font-medium hover:bg-terracotta transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isAdding ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-5 h-5" />
                                            Ajouter au panier
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
