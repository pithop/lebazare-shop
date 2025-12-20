import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/lib/types';

export default async function AccountPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch orders for this user based on email
    // Note: ideally we would use user_id, but for now we match by email in customer_details
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .filter('customer_details->>email', 'eq', user.email)
        .order('created_at', { ascending: false });

    return (
        <div className="container mx-auto px-4 py-12 lg:py-16">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                    <div>
                        <h1 className="font-serif text-3xl lg:text-4xl text-slate-900 mb-2">Mon Compte</h1>
                        <p className="text-slate-500">Bienvenue, {user.email}</p>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                            Se déconnecter
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                    <div className="p-6 border-b border-stone-100">
                        <h2 className="font-serif text-xl text-slate-900">Mes Commandes</h2>
                    </div>

                    {orders && orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-stone-50">
                                    <tr>
                                        <th className="px-6 py-4 font-medium text-slate-500 text-sm">N° Commande</th>
                                        <th className="px-6 py-4 font-medium text-slate-500 text-sm">Date</th>
                                        <th className="px-6 py-4 font-medium text-slate-500 text-sm">Statut</th>
                                        <th className="px-6 py-4 font-medium text-slate-500 text-sm">Total</th>
                                        <th className="px-6 py-4 font-medium text-slate-500 text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {orders.map((order: Order) => (
                                        <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                #{order.id.slice(0, 8)}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {order.status === 'paid' ? 'Payé' :
                                                        order.status === 'pending' ? 'En attente' : order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {order.total.toFixed(2)} €
                                            </td>
                                            <td className="px-6 py-4">
                                                {/* We could add a link to order details if we have a public order page or user-specific one */}
                                                <span className="text-slate-400 text-sm">Détails indisponibles</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-slate-500 mb-4">Vous n'avez pas encore passé de commande.</p>
                            <Link href="/produits" className="text-terracotta hover:underline font-medium">
                                Découvrir nos produits
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
