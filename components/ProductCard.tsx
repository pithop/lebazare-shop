import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  const { handle, title, priceRange, images } = product;
  const image = images.edges[0]?.node;
  const price = priceRange.minVariantPrice;

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link href={`/produits/${handle}`} className="block relative aspect-[4/5] overflow-hidden bg-stone-100">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            No Image
          </div>
        )}

        {/* Quick Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex justify-center">
            <span className="bg-white text-dark-text px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-terracotta hover:text-white transition-colors">
              Voir le produit
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-serif font-medium text-dark-text mb-1 group-hover:text-terracotta transition-colors">
          <Link href={`/produits/${handle}`}>
            {title}
          </Link>
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-stone-600 font-medium">
            {parseFloat(price.amount).toLocaleString('fr-FR', {
              style: 'currency',
              currency: price.currencyCode,
            })}
          </p>
          {/* We could add a mini add to cart here if needed, but keeping it clean for now */}
        </div>
      </div>
    </div>
  );
}
