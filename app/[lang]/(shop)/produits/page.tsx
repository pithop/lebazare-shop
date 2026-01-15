import { getFilteredProducts, getAllProducts } from '@/lib/products';
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
  let allProductsForFilters: Product[] = [];

  // Filtering Logic Params
  const query = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : undefined;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const minPrice = typeof searchParams.minPrice === 'string' ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? parseFloat(searchParams.maxPrice) : undefined;

  try {
    // Parallelize queries for performance
    const [fetchedProducts, allProducts] = await Promise.all([
      getFilteredProducts({
        query,
        category,
        minPrice,
        maxPrice,
        limit: 100
      }),
      getAllProducts(100)
    ]);

    products = fetchedProducts;
    allProductsForFilters = allProducts;

    if (products.length === 0 && !query && !category) {
      // Only fallback to examples if absolutely no products exist in DB and no filters are applied
      const check = await getAllProducts(1);
      if (check.length === 0) {
        products = exampleProducts;
      }
    }

  } catch (err) {
    console.error('Error fetching products:', err);
    products = exampleProducts;
  }

  // Calculate Filter Options based on a broader set (or just the current set)
  const categories = Array.from(new Set(allProductsForFilters.map(p => p.category).filter((c): c is string => !!c)));
  const prices = allProductsForFilters.map(p => parseFloat(p.priceRange.minVariantPrice.amount));
  const globalMinPrice = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const globalMaxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 2000;

  return (
    <div className="bg-beige min-h-screen bg-grain overflow-x-hidden">

      {/* Massive Editorial Header - Updated for Winter & Size */}
      <header className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 md:px-12">
        <div className="max-w-[90vw] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 md:gap-24 border-b border-dark-text/10 pb-8">
            <h1 className="text-[10vw] md:text-[8vw] leading-[0.9] font-serif text-dark-text tracking-tighter">
              Collection
              <span className="block ml-[5vw] italic text-terracotta opacity-80">
                Hiver
              </span>
            </h1>

            <div className="md:w-1/3 mb-2">
              <p className="text-base md:text-lg font-light text-stone-600 leading-relaxed text-balance">
                Une exploration de la matière et de la forme. Chaque objet est une invitation au voyage, façonné par des mains expertes pour sublimer votre quotidien.
              </p>
              <div className="mt-6 flex gap-4 text-xs font-medium uppercase tracking-widest text-stone-400">
                <span>{products.length} Objets</span>
                <span>•</span>
                <span>Edition Limitée</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 md:px-8 pb-32">

        {/* Floating Filters (Client Component) */}
        <ProductFilters
          categories={categories}
          minPrice={globalMinPrice}
          maxPrice={globalMaxPrice}
        />

        {/* Asymmetrical / Broken Grid */}
        <div className="max-w-[95vw] mx-auto">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <h3 className="text-4xl font-serif text-stone-300 mb-4">Vide</h3>
              <p className="text-stone-500 mb-8">Aucun produit ne correspond à votre recherche.</p>
              <button
                onClick={() => window.location.href = window.location.pathname}
                className="text-terracotta font-medium hover:text-dark-text transition-colors underline underline-offset-4"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-24">
              {products.map((product, index) => (
                <div key={product.id} className={`${index % 2 === 0 ? 'mt-0' : 'mt-12 md:mt-24'} break-inside-avoid`}>
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
