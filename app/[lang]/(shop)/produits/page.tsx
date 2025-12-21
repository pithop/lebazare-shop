import { getAllProducts } from '@/lib/products';
import { exampleProducts } from '@/lib/example-products';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import ProductFilters from '@/components/shop/ProductFilters';

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
    products = await getAllProducts(100); // Fetch more to allow filtering

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
  const maxPrice = typeof searchParams.maxPrice === 'string' ? parseFloat(searchParams.maxPrice) : 2000;

  // Get unique categories and price range
  const categories = Array.from(new Set(products.map(p => p.category).filter((c): c is string => !!c)));
  const prices = products.map(p => parseFloat(p.priceRange.minVariantPrice.amount));
  const globalMinPrice = Math.floor(Math.min(...prices, 0));
  const globalMaxPrice = Math.ceil(Math.max(...prices, 1000));

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(query);
    const matchesCategory = category === 'all' || product.category === category;
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    const matchesPrice = price >= minPrice && price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">Nos Créations</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
          Une collection authentique, façonnée à la main avec passion et savoir-faire.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <ProductFilters
              categories={categories}
              minPrice={globalMinPrice}
              maxPrice={globalMaxPrice}
            />
          </div>
        </aside>

        {/* Mobile Filter Drawer Trigger (To be implemented properly, for now simple details) */}
        <div className="lg:hidden mb-6">
          <details className="group">
            <summary className="flex items-center justify-between p-4 bg-stone-50 rounded-lg cursor-pointer list-none">
              <span className="font-medium text-slate-900">Filtres</span>
              <span className="transition group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </summary>
            <div className="p-4 border border-stone-100 border-t-0 rounded-b-lg">
              <ProductFilters
                categories={categories}
                minPrice={globalMinPrice}
                maxPrice={globalMaxPrice}
              />
            </div>
          </details>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          {usingExamples && (
            <div className="mb-8 bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <p>
                Mode démonstration : Produits d'exemple affichés.
                Connectez votre base de données pour voir vos vrais produits.
              </p>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-stone-50 rounded-lg border border-stone-100 border-dashed">
              <p className="text-xl text-slate-500 mb-2">Aucun produit trouvé</p>
              <p className="text-slate-400 text-sm">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
