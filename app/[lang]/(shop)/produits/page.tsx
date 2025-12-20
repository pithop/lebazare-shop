import { getAllProducts } from '@/lib/products';
import { exampleProducts } from '@/lib/example-products';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';

// export const dynamic = 'force-dynamic'; // Removed to allow ISR
export const revalidate = 60;

export const metadata = {
  title: 'Produits - LeBazare',
  description: 'Découvrez notre collection de créations artisanales en matières naturelles',
};

type Props = {
  params: { lang: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ProduitsPage({ params: { lang }, searchParams }: Props) {
  let products: Product[] = [];
  let error: Error | null = null;
  let usingExamples = false;

  try {
    products = await getAllProducts(50); // Fetch more to allow filtering

    // Si aucun produit de Shopify, utiliser les exemples
    if (products.length === 0) {
      products = exampleProducts;
      usingExamples = true;
    }
  } catch (err) {
    console.error('Error fetching products:', err);
    error = err as Error;

    // En cas d'erreur, utiliser les produits d'exemple
    products = exampleProducts;
    usingExamples = true;
  }

  // Basic in-memory filtering (since we don't have advanced Shopify query setup yet)
  const query = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : 'all';
  const minPrice = typeof searchParams.minPrice === 'string' ? parseFloat(searchParams.minPrice) : 0;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? parseFloat(searchParams.maxPrice) : 1000;

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(query);
    const matchesCategory = category === 'all' || product.category === category;
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    const matchesPrice = price >= minPrice && price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif text-terracotta mb-4">Nos Produits</h1>
        <p className="text-lg text-dark-text max-w-2xl mx-auto">
          Découvrez notre collection de créations artisanales uniques.
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {categories.map((cat) => (
            <a
              key={cat as string}
              href={`/${lang}/produits?category=${cat}`}
              className={`px-6 py-2 rounded-full border transition-all ${category === cat
                ? 'bg-terracotta text-white border-terracotta'
                : 'bg-white text-slate-600 border-slate-200 hover:border-terracotta hover:text-terracotta'
                }`}
            >
              {cat === 'all' ? 'Tous' : cat}
            </a>
          ))}
        </div>

        {usingExamples && (
          <div className="mt-6 bg-ocre/20 border border-ocre rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-dark-text">
              <strong>Note:</strong> Produits d'exemple affichés.
              Connectez votre boutique Shopify pour voir vos vrais produits.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-12">
        {/* Product Grid */}
        <div className="flex-grow">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-stone-50 rounded-lg">
              <p className="text-xl text-dark-text/60 mb-4">
                Aucun produit ne correspond à votre recherche.
              </p>
              <p className="text-dark-text/60">
                Essayez d'autres termes ou revenez plus tard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!usingExamples && error && (
            <div className="mt-12 text-center">
              <p className="text-dark-text/60 mb-6">
                Vous pouvez également visiter notre boutique Etsy :
              </p>
              <a
                href="https://www.etsy.com/shop/LeBazare"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-accent-red text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Visiter notre boutique Etsy
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
