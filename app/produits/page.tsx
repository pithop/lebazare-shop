import { getAllProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata = {
  title: 'Produits - LeBazare',
  description: 'Découvrez notre collection de créations artisanales en matières naturelles',
};

export default async function ProduitsPage() {
  let products: any[] = [];
  let error: Error | null = null;

  try {
    products = await getAllProducts(20);
  } catch (err) {
    console.error('Error fetching products:', err);
    error = err as Error;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif text-terracotta mb-4">Nos Produits</h1>
        <p className="text-lg text-dark-text max-w-2xl mx-auto">
          Découvrez notre collection de créations artisanales uniques,
          façonnées avec passion dans des matières naturelles authentiques.
        </p>
      </div>

      {error ? (
        <div className="text-center py-20">
          <p className="text-xl text-dark-text/60 mb-4">
            Impossible de charger les produits pour le moment.
          </p>
          <p className="text-dark-text/60 mb-6">
            Veuillez réessayer plus tard ou visitez notre boutique Etsy.
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
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-dark-text/60 mb-4">
            Aucun produit disponible pour le moment.
          </p>
          <p className="text-dark-text/60">
            Nous travaillons à ajouter de nouvelles créations. Revenez bientôt !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
