import { getAllProducts } from '@/lib/products';
import { exampleProducts } from '@/lib/example-products';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import ProductFilters from '@/components/shop/ProductFilters';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Collection | LeBazare',
  description: 'Une curation de pièces uniques.',
};

type Props = {
  params: { lang: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ProduitsPage({ params: { lang }, searchParams }: Props) {
  let products: Product[] = [];
  let usingExamples = false;

  try {
    products = await getAllProducts(100);

    if (products.length === 0) {
      products = exampleProducts;
      usingExamples = true;
    }
  } catch (err) {
    console.error('Error fetching products:', err);
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

      {/* Artistic Header */}
      <div className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <p className="text-terracotta text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-6 animate-fade-in">
              Collection 2024
            </p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-dark-text leading-[0.9] tracking-tighter mb-8">
              L'Art de <br />
              <span className="italic font-light text-stone-400">Vivre</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-600 max-w-xl font-light leading-relaxed border-l-2 border-terracotta pl-6">
              Une sélection curatée d'objets intemporels, façonnés par la main de l'homme et l'âme de la matière.
            </p>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-bl from-terracotta to-transparent rounded-bl-[100px]" />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-32">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Minimal Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0 pt-4">
            <div className="sticky top-32">
              <h3 className="font-serif text-2xl mb-8 text-dark-text">Filtres</h3>
              <ProductFilters
                categories={categories}
                minPrice={globalMinPrice}
                maxPrice={globalMaxPrice}
              />
            </div>
          </aside>

          {/* Mobile Filter Trigger */}
          <div className="lg:hidden mb-12 sticky top-24 z-30">
            <details className="group relative">
              <summary className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border border-stone-200 rounded-full shadow-sm cursor-pointer list-none hover:border-terracotta transition-colors">
                <span className="font-medium text-dark-text flex items-center gap-2 text-sm uppercase tracking-wider">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-terracotta">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                  Filtrer la collection
                </span>
                <span className="transition-transform duration-300 group-open:rotate-180 text-stone-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="absolute top-full left-0 right-0 mt-2 bg-white p-6 border border-stone-100 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <ProductFilters
                  categories={categories}
                  minPrice={globalMinPrice}
                  maxPrice={globalMaxPrice}
                />
              </div>
            </details>
          </div>

          {/* Masonry Grid */}
          <div className="flex-grow">
            {usingExamples && (
              <div className="mb-12 bg-stone-100/50 rounded-lg p-4 text-xs text-stone-500 flex items-center gap-2 justify-center">
                <span className="w-2 h-2 bg-terracotta rounded-full animate-pulse" />
                Mode Démonstration
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <h3 className="text-4xl font-serif text-stone-300 mb-4">Vide</h3>
                <p className="text-stone-500 max-w-md mx-auto mb-8 font-light">
                  Aucune pièce ne correspond à votre recherche.
                </p>
                <button
                  onClick={() => window.location.href = window.location.pathname}
                  className="text-terracotta font-medium hover:text-dark-text transition-colors underline underline-offset-4"
                >
                  Réinitialiser
                </button>
              </div>
            ) : (
              // Masonry Layout using CSS Columns
              <div className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
