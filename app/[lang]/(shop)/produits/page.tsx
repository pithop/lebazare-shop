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
    <div className="bg-beige min-h-screen bg-grain overflow-x-hidden">

      {/* Massive Editorial Header */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-12">
        <div className="max-w-[90vw] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 md:gap-24 border-b border-dark-text/10 pb-12">
            <h1 className="text-[15vw] md:text-[12vw] leading-[0.8] font-serif text-dark-text tracking-tighter">
              Collection
              <span className="block ml-[10vw] italic text-terracotta opacity-80">
                Automne
              </span>
            </h1>

            <div className="md:w-1/3 mb-4">
              <p className="text-lg md:text-xl font-light text-stone-600 leading-relaxed text-balance">
                Une exploration de la matière et de la forme. Chaque objet est une invitation au voyage, façonné par des mains expertes pour sublimer votre quotidien.
              </p>
              <div className="mt-8 flex gap-4 text-xs font-medium uppercase tracking-widest text-stone-400">
                <span>{filteredProducts.length} Objets</span>
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
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <h3 className="text-4xl font-serif text-stone-300 mb-4">Vide</h3>
              <button
                onClick={() => window.location.href = window.location.pathname}
                className="text-terracotta font-medium hover:text-dark-text transition-colors underline underline-offset-4"
              >
                Réinitialiser
              </button>
            </div>
          ) : (
            // Using CSS Grid with auto-flow dense for a packed look, or just columns for masonry
            // Let's stick to columns for true masonry but add some spacing quirks via the Card component index
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-24">
              {filteredProducts.map((product, index) => (
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
