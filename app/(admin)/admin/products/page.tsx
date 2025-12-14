import { createClient } from '@/lib/supabase-server';
import Image from 'next/image';
import Link from 'next/link';
import { deleteProduct } from '@/actions/products';
import DeleteProductButton from '@/components/DeleteProductButton';

export default async function ProductsPage() {
    const supabase = createClient();
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-slate-800">Produits</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    + Ajouter un produit
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">Image</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">Titre</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">Prix</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">Stock</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">Source</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products?.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                                        {product.images?.[0] && (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-800">{product.title}</td>
                                <td className="px-6 py-4 text-slate-600">{product.price} €</td>
                                <td className="px-6 py-4 text-slate-600">{product.stock}</td>
                                <td className="px-6 py-4">
                                    {product.etsy_id ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                            Etsy
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Manuel
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            Modifier
                                        </Link>
                                        <DeleteProductButton id={product.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!products || products.length === 0) && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    Aucun produit trouvé. Lancez la synchronisation Etsy ou ajoutez-en un manuellement.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
