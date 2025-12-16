import { getProductByHandle } from '@/lib/products';
import { exampleProducts } from '@/lib/example-products';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

export const dynamic = 'force-dynamic';
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
      };
    }

    return {
      title: `${product.title} - LeBazare`,
      description: product.description || `Découvrez ${product.title} sur LeBazare`,
    };
  } catch (error) {
    return {
      title: 'Produit - LeBazare',
    };
  }
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  let product = null;

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
  const mainImage = images[0];
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const currency = product.priceRange.minVariantPrice.currencyCode;
  const defaultVariant = product.variants.edges[0]?.node;

  const formatPrice = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto">
        {/* Image Gallery */}
        <div className="space-y-4 lg:sticky lg:top-24 h-fit">
          <div className="relative aspect-square bg-stone-50 rounded-2xl overflow-hidden shadow-sm">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.altText || product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-32 h-32"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative aspect-square bg-stone-50 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.title} - Image ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-8 lg:pt-8">
          <div>
            <h1 className="text-3xl lg:text-5xl font-serif text-slate-900 mb-4 leading-tight">{product.title}</h1>
            <p className="text-2xl lg:text-3xl font-medium text-accent-red">
              {formatPrice(price, currency)}
            </p>
          </div>

          {/* Add to Cart */}
          {defaultVariant && (
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
              {defaultVariant.availableForSale ? (
                <AddToCartButton
                  variantId={defaultVariant.id}
                  productTitle={product.title}
                  price={price}
                  image={mainImage?.url || ''}
                />
              ) : (
                <button
                  disabled
                  className="w-full bg-slate-200 text-slate-500 px-8 py-4 rounded-lg text-lg font-medium cursor-not-allowed"
                >
                  Rupture de stock
                </button>
              )}
              <p className="text-sm text-center text-slate-500 mt-4">
                Expédié via notre partenaire logistique sécurisé.
              </p>
            </div>
          )}

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
    </div>
  );
}
