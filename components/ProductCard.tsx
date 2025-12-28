import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  const { handle, title, priceRange, images } = product;
  const image = images.edges[0]?.node;
  const price = priceRange.minVariantPrice;

  return (
    <div className="group relative flex flex-col h-full">
      <Link href={`/produits/${handle}`} className="block relative aspect-[3/4] overflow-hidden bg-stone-100 rounded-sm mb-4">
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

        {/* Quick Action Overlay - Desktop */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:block">
          <div className="flex justify-center">
            <span className="bg-white/90 backdrop-blur-sm text-dark-text px-6 py-3 rounded-full text-sm font-medium shadow-sm hover:bg-terracotta hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
              Voir le produit
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-serif text-dark-text mb-1 group-hover:text-terracotta transition-colors line-clamp-2 leading-tight">
          <Link href={`/produits/${handle}`}>
            {title}
          </Link>
        </h3>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <p className="text-stone-600 font-medium font-sans text-sm tracking-wide">
            {parseFloat(price.amount).toLocaleString('fr-FR', {
              style: 'currency',
              currency: price.currencyCode,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
