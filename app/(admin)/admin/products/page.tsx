import { createAdminClient } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase-server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import DeleteProductButton from '@/components/DeleteProductButton';

export default async function ProductsPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    const adminClient = createAdminClient();
    const { data: products } = await adminClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Produits</h1>
                    <p className="text-slate-500 mt-1">Gérez votre catalogue, vos stocks et vos prix.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Ajouter un produit</span>
                </Link>
            </div>

            {/* Filters & Search Bar (Visual Only for now) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
                    <Filter className="w-4 h-4" />
                    Filtres
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Produit</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Prix</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Source</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products?.map((product) => {
                                const isLowStock = product.stock > 0 && product.stock < 5;
                                const isOutOfStock = product.stock === 0;

                                return (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                                    {product.images?.[0] ? (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <Package className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-900 truncate max-w-[200px]">{product.title}</p>
                                                    <p className="text-xs text-slate-500 truncate">{product.id.slice(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isOutOfStock ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                    <AlertCircle className="w-3 h-3" />
                                                    Rupture
                                                </span>
                                            ) : isLowStock ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                    <AlertCircle className="w-3 h-3" />
                                                    Faible
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    En stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                            {product.stock} unités
                                        </td>
                                        <td className="px-6 py-4 text-sm font-serif text-slate-900">
                                            {product.price.toFixed(2)} €
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.etsy_id ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                                    Etsy
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                    Manuel
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                                                    title="Modifier"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <div className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                                                    <DeleteProductButton id={product.id} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!products || products.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Package className="w-12 h-12 mb-4 opacity-20" />
                                            <p className="text-lg font-medium text-slate-900 mb-1">Aucun produit trouvé</p>
                                            <p className="text-sm mb-6">Commencez par ajouter votre premier produit ou synchronisez avec Etsy.</p>
                                            <Link
                                                href="/admin/products/new"
                                                className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                                            >
                                                Ajouter un produit
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
