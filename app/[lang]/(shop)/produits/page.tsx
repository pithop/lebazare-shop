import { getFilteredProducts, getAllProducts } from '@/lib/products';
import { exampleProducts } from '@/lib/example-products';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import ProductFilters from '@/components/shop/ProductFilters';
import { getCategorySEOContent, getCategoryFAQs } from '@/lib/seo-content';
import { FAQSchema } from '@/components/seo/FAQSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: { lang: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Dynamic SEO metadata based on category filter
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;

  if (category) {
    const seoContent = getCategorySEOContent(category);
    if (seoContent) {
      return {
        title: seoContent.metaTitle,
        description: seoContent.metaDescription,
        keywords: seoContent.keywords,
        openGraph: {
          title: seoContent.metaTitle,
          description: seoContent.metaDescription,
          type: 'website',
        },
      };
    }
  }

  // Default metadata for all products
  return {
    title: 'Collection Artisanat Marocain | LeBazare',
    description: 'Découvrez notre collection d\'artisanat marocain : luminaires en paille, mobilier en bois, sacs et vannerie. Pièces uniques faites main, expédiées depuis la France.',
    keywords: ['artisanat marocain', 'décoration bohème', 'mobilier artisanal', 'luminaires paille', 'fait main'],
  };
}

export default async function ProduitsPage({ params: { lang }, searchParams }: Props) {
  let products: Product[] = [];
  let allProductsForFilters: Product[] = [];

  // Filtering Logic Params
  const query = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : undefined;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const minPrice = typeof searchParams.minPrice === 'string' ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? parseFloat(searchParams.maxPrice) : undefined;

  // Get SEO content for category
  const categorySEO = category ? getCategorySEOContent(category) : undefined;
  const categoryFAQs = category ? getCategoryFAQs(category) : [];

  // Breadcrumb items
  const breadcrumbItems = [
    { name: 'Accueil', item: `https://www.lebazare.fr/${lang}` },
    { name: 'Collection', item: `https://www.lebazare.fr/${lang}/produits` },
    ...(category ? [{ name: categorySEO?.title || category, item: `https://www.lebazare.fr/${lang}/produits?category=${encodeURIComponent(category)}` }] : [])
  ];

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
      {/* Structured Data Schemas */}
      <BreadcrumbSchema items={breadcrumbItems} />
      {categoryFAQs.length > 0 && <FAQSchema faqs={categoryFAQs} />}

      {/* Massive Editorial Header - Updated for Winter & Size */}
      <header className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 md:px-12">
        <div className="max-w-[90vw] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 md:gap-24 border-b border-dark-text/10 pb-8">
            <h1 className="text-[10vw] md:text-[8vw] leading-[0.9] font-serif text-dark-text tracking-tighter">
              {categorySEO?.heroTitle || 'Collection'}
              <span className="block ml-[5vw] italic text-terracotta opacity-80">
                {categorySEO?.heroSubtitle || 'Hiver'}
              </span>
            </h1>

            <div className="md:w-1/3 mb-2">
              <p className="text-base md:text-lg font-light text-stone-600 leading-relaxed text-balance">
                {categorySEO ? categorySEO.seoContent.split('\n')[0].replace(/^## /, '') : 'Une exploration de la matière et de la forme. Chaque objet est une invitation au voyage, façonné par des mains expertes pour sublimer votre quotidien.'}
              </p>
              <div className="mt-6 flex gap-4 text-xs font-medium uppercase tracking-widest text-stone-400">
                <span>{products.length} Objets</span>
                <span>•</span>
                <span>{categorySEO ? 'Artisanat Authentique' : 'Edition Limitée'}</span>
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
              <a
                href={`/${lang}/produits`}
                className="text-terracotta font-medium hover:text-dark-text transition-colors underline underline-offset-4"
              >
                Réinitialiser les filtres
              </a>
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

        {/* SEO Content Section - Only shown when category is selected */}
        {categorySEO && (
          <section className="max-w-4xl mx-auto mt-24 pt-16 border-t border-dark-text/10">
            {/* SEO Text Content */}
            <article className="prose prose-stone prose-lg max-w-none">
              <div
                className="text-stone-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: categorySEO.seoContent
                    .replace(/## (.*)/g, '<h2 class="text-2xl font-serif text-dark-text mt-8 mb-4">$1</h2>')
                    .replace(/### (.*)/g, '<h3 class="text-xl font-medium text-dark-text mt-6 mb-3">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n- (.*)/g, '<li class="ml-4">$1</li>')
                    .replace(/\n\n/g, '</p><p class="mb-4">')
                }}
              />
            </article>

            {/* FAQ Accordion */}
            {categoryFAQs.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-serif text-dark-text mb-8">Questions Fréquentes</h2>
                <div className="space-y-4">
                  {categoryFAQs.map((faq, index) => (
                    <details
                      key={index}
                      className="group bg-white/50 rounded-lg border border-stone-200 overflow-hidden"
                    >
                      <summary className="flex justify-between items-center p-5 cursor-pointer font-medium text-dark-text hover:bg-white/80 transition-colors">
                        {faq.question}
                        <span className="text-terracotta group-open:rotate-180 transition-transform">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <p className="px-5 pb-5 text-stone-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
