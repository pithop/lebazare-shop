import { getAllProducts, getProductByHandle, getRelatedProducts, getStaticProducts } from '@/lib/products';
import { exampleProducts } from '@/lib/example-products';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductVariantSelector from '@/components/shop/ProductVariantSelector';
import RelatedProducts from '@/components/shop/RelatedProducts';
import JsonLd from '@/components/JsonLd';
import { Product } from '@/lib/types';

import { i18n } from '@/i18n-config';

export async function generateStaticParams() {
  const products = await getStaticProducts(20);

  const params = [];
  for (const locale of i18n.locales) {
    for (const product of products) {
      params.push({
        lang: locale,
        handle: product.handle,
      });
    }
  }

  return params;
}

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { handle: string } }) {
  try {
    let product = await getProductByHandle(params.handle);

    // Fallback to example products if not found in Shopify
    if (!product) {
      product = exampleProducts.find(p => p.handle === params.handle) || null;
    }

    if (!product) {
      return {
        title: 'Produit introuvable - LeBazare',
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    return {
      title: `${product.title} - LeBazare`,
      description: product.description || `Découvrez ${product.title} sur LeBazare`,
      openGraph: {
        title: product.title,
        description: product.description || `Découvrez ${product.title} sur LeBazare`,
        url: `https://www.lebazare.fr/produits/${product.handle}`,
        images: product.images.edges.map(edge => ({
          url: edge.node.url,
          alt: edge.node.altText || product?.title,
        })),
        type: 'website',
      },
      alternates: {
        canonical: `https://www.lebazare.fr/produits/${product.handle}`,
      },
    };
  } catch (error) {
    return {
      title: 'Produit - LeBazare',
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  let product: Product | null | undefined = null;

  try {
    product = await getProductByHandle(params.handle);
  } catch (error) {
    console.error('Error fetching product from Shopify:', error);
  }

  // Fallback to example products if not found in Shopify
  if (!product) {
    product = exampleProducts.find(p => p.handle === params.handle) || null;
  }

  if (!product) {
    notFound();
  }

  const images = product.images.edges.map((edge) => edge.node);
  const variants = product.variants.edges.map((edge) => edge.node);
  const relatedProducts = await getRelatedProducts(product.id, product.category);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: images.map((img) => img.url),
    sku: product.handle,
    brand: {
      '@type': 'Brand',
      name: 'LeBazare',
    },
    offers: {
      '@type': 'Offer',
      price: variants[0]?.priceV2.amount || '0',
      priceCurrency: variants[0]?.priceV2.currencyCode || 'EUR',
      availability: variants[0]?.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://www.lebazare.fr/produits/${product.handle}`,
      itemCondition: 'https://schema.org/NewCondition',
    },
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <JsonLd data={jsonLd} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto">
        {/* Image Gallery */}
        <ProductGallery images={images} title={product.title} videoUrl={product.video_url} />

        {/* Product Details */}
        <div className="flex flex-col space-y-8 lg:pt-8">
          <ProductVariantSelector product={product} variants={variants} />

          {product.description && (
            <div className="prose prose-lg prose-slate max-w-none">
              <h3 className="font-serif text-xl text-slate-900 mb-4">Description</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Product Info */}
          <div className="border-t border-slate-200 pt-8">
            <h3 className="font-serif text-lg text-slate-900 mb-4">Pourquoi choisir ce produit ?</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li className="flex items-center p-4 bg-stone-50 rounded-lg">
                <span className="text-terracotta mr-3 text-xl">✦</span>
                <span className="text-slate-700 font-medium">Création artisanale unique</span>
              </li>
              <li className="flex items-center p-4 bg-stone-50 rounded-lg">
                <span className="text-terracotta mr-3 text-xl">🌿</span>
                <span className="text-slate-700 font-medium">Matières naturelles</span>
              </li>
              <li className="flex items-center p-4 bg-stone-50 rounded-lg">
                <span className="text-terracotta mr-3 text-xl">❤️</span>
                <span className="text-slate-700 font-medium">Fait main avec passion</span>
              </li>
              <li className="flex items-center p-4 bg-stone-50 rounded-lg">
                <span className="text-terracotta mr-3 text-xl">🚚</span>
                <span className="text-slate-700 font-medium">Livraison soignée</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
