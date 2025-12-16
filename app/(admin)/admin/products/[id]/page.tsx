import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: product } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('id', params.id)
        .single();

    if (!product) {
        notFound();
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="text-slate-500 hover:text-slate-800">
                    ← Retour
                </Link>
                <h1 className="text-3xl font-serif text-slate-800">Modifier le Produit</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <EditProductForm product={product} />
            </div>
        </div>
    );
}
