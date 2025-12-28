import { getAllProducts } from '@/lib/products';
import { exampleProducts } from '@/lib/example-products';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import ProductFilters from '@/components/shop/ProductFilters';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Nos Créations | LeBazare',
  description: 'Découvrez notre collection de créations artisanales en matières naturelles, façonnées à la main.',
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
    products = await getAllProducts(100);

    if (products.length === 0) {
      products = exampleProducts;
      usingExamples = true;
    }
  } catch (err) {
    console.error('Error fetching products:', err);
    error = err as Error;
    products = exampleProducts;
    usingExamples = true;
  }

  // Filtering Logic
  const query = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : 'all';
  const minPrice = typeof searchParams.minPrice === 'string' ? parseFloat(searchParams.minPrice) : 0;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? parseFloat(searchParams.maxPrice) : 2000;

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
    <div className="bg-beige min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-stone-100 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-grid-lg text-stone-300" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-dark-text mb-6 tracking-tight">
            Nos Créations
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
            Une collection authentique, où chaque pièce raconte une histoire de passion et de savoir-faire artisanal.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28 bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
              <ProductFilters
                categories={categories}
                minPrice={globalMinPrice}
                maxPrice={globalMaxPrice}
              />
            </div>
          </aside>

          {/* Mobile Filter Trigger */}
          <div className="lg:hidden mb-8">
            {/* Note: In a real app, this would trigger a client-side drawer. 
                 For this server component, we'll use a simple details/summary for now, 
                 but styled to look like a premium toggle. 
                 Ideally, we should move the whole page content to a Client Component or use a separate Client Component for the mobile filter drawer.
             */}
            <details className="group relative z-20">
              <summary className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl shadow-sm cursor-pointer list-none hover:border-terracotta transition-colors">
                <span className="font-medium text-dark-text flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-terracotta">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                  Filtrer & Trier
                </span>
                <span className="transition-transform duration-300 group-open:rotate-180 text-stone-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="absolute top-full left-0 right-0 mt-2 bg-white p-6 border border-stone-100 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
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
                </p>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-3xl">
                  🍂
                </div>
                <h3 className="text-2xl font-serif text-dark-text mb-3">Aucun résultat</h3>
                <p className="text-stone-500 max-w-md mx-auto mb-8">
                  Essayez de modifier vos filtres ou d'élargir votre recherche pour trouver votre bonheur.
                </p>
                <button
                  onClick={() => window.location.href = window.location.pathname}
                  className="text-terracotta font-medium hover:text-dark-text transition-colors underline underline-offset-4"
                >
                  Effacer tous les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-12">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
