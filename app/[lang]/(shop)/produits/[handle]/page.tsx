import { getAllProducts, getProductByHandle, getRelatedProducts, getStaticProducts } from '@/lib/products';
import { exampleProducts } from '@/lib/example-products';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductVariantSelector from '@/components/shop/ProductVariantSelector';
import RelatedProducts from '@/components/shop/RelatedProducts';
import { Product } from '@/lib/types';
import { ProductSchema } from '@/components/seo/ProductSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { i18n } from '@/i18n-config';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewList from '@/components/reviews/ReviewList';
import { getProductReviews } from '@/actions/reviews';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { handle: string; lang: string } }) {
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

    const isEnglish = params.lang === 'en';
    const title = (isEnglish && product.title_en) ? product.title_en : (product.seo_title || product.title);
    const description = (isEnglish && product.description_en) ? product.description_en : (product.description || `Découvrez ${product.title} sur LeBazare`);

    return {
      title: `${title} - LeBazare`,
      description: description,
      openGraph: {
        title: title,
        description: description,
        url: `https://www.lebazare.fr/${params.lang}/produits/${product.handle}`,
        images: product.images.edges.map(edge => ({
          url: edge.node.url,
          alt: edge.node.altText || product?.title,
        })),
        type: 'website',
      },
      alternates: {
        canonical: `https://www.lebazare.fr/${params.lang}/produits/${product.handle}`,
        languages: {
          'fr': `https://www.lebazare.fr/fr/produits/${product.handle}`,
          'en': `https://www.lebazare.fr/en/produits/${product.handle}`,
        }
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

export default async function ProductPage({ params }: { params: { handle: string; lang: string } }) {
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

  const isEnglish = params.lang === 'en';
  const displayTitle = (isEnglish && product.title_en) ? product.title_en : product.title;
  const displayDescription = (isEnglish && product.description_en) ? product.description_en : product.description;

  const images = product.images.edges.map((edge) => edge.node);
  const variants = product.variants.edges.map((edge) => edge.node);
  const relatedProducts = await getRelatedProducts(product.id, product.category);
  const reviews = await getProductReviews(product.id);

  // Calculate aggregate rating
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : null;

  // Logic to determine shipping for Schema
  const isMorocco = product.origin_country === 'MA';
  const shippingSchema = {
    cost: isMorocco ? 25.00 : 8.00,
    minDays: isMorocco ? 5 : 2,
    maxDays: isMorocco ? 10 : 4
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <ProductSchema
        product={{
          name: product.seo_title || product.title,
          description: displayDescription || '',
          images: images.map((img) => img.url),
          sku: product.handle,
          price: parseFloat(variants[0]?.priceV2.amount || '0'),
          currency: variants[0]?.priceV2.currencyCode || 'EUR',
          availability: variants[0]?.availableForSale ? 'InStock' : 'OutOfStock',
          brand: 'LeBazare',
          aggregateRating: averageRating ? {
            ratingValue: averageRating,
            reviewCount: reviews.length
          } : undefined
        }}
        shipping={shippingSchema}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Accueil', item: `https://www.lebazare.fr/${params.lang}` },
          { name: 'Produits', item: `https://www.lebazare.fr/${params.lang}/produits` },
          { name: displayTitle, item: `https://www.lebazare.fr/${params.lang}/produits/${product.handle}` }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 max-w-7xl mx-auto">
        {/* Left Column: Image Gallery (Scrollable) */}
        <div className="lg:col-span-7 lg:pr-8">
          <ProductGallery images={images} title={displayTitle} videoUrl={product.video_url} />
        </div>

        {/* Right Column: Product Details (Sticky) */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 space-y-8">
            {/* Header */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <h1 className="text-3xl lg:text-4xl font-serif text-slate-900 leading-tight">
                {displayTitle}
              </h1>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-light text-slate-900">
                  {variants[0]?.priceV2.amount} {variants[0]?.priceV2.currencyCode}
                </div>
                {/* Stock Status Badge */}
                {variants[0]?.availableForSale ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    En stock
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                    Épuisé
                  </span>
                )}
              </div>
            </div>

            {/* Variant Selector & Add to Cart */}
            <ProductVariantSelector product={{ ...product, title: displayTitle }} variants={variants} />

            {/* Description */}
            {displayDescription && (
              <div className="prose prose-slate prose-p:text-slate-600 prose-headings:font-serif prose-headings:font-normal max-w-none">
                <h3 className="text-lg mb-2">À propos</h3>
                <p className="whitespace-pre-line leading-relaxed text-sm">
                  {displayDescription}
                </p>
              </div>
            )}

            {/* Features (Minimalist) */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-stone-50 text-terracotta">
                  🌿
                </span>
                <span className="text-xs font-medium text-slate-700">100% Naturel</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-stone-50 text-terracotta">
                  ✋
                </span>
                <span className="text-xs font-medium text-slate-700">Fait Main</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-stone-50 text-terracotta">
                  ✨
                </span>
                <span className="text-xs font-medium text-slate-700">Pièce Unique</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-stone-50 text-terracotta">
                  🚚
                </span>
                <span className="text-xs font-medium text-slate-700">
                  {isMorocco ? 'Expédié du Maroc (5-10j)' : 'Expédié de France (2-4j)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-slate-100 pt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-serif text-slate-900 mb-8 text-center">Avis Clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-medium mb-6">Ce qu'ils en pensent</h3>
            <ReviewList reviews={reviews} />
          </div>
          <div>
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </div>

      <div className="mt-24 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-serif text-slate-900 mb-8 text-center">Vous aimerez aussi</h2>
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}
