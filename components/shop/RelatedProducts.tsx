import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

interface RelatedProductsProps {
    products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="mt-16 lg:mt-24 border-t border-slate-200 pt-16">
            <h2 className="font-serif text-2xl lg:text-3xl text-slate-900 mb-8 text-center">
                Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
