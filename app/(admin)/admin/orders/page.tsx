import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Order } from '@/lib/types'
import { Search, Filter, Eye, Clock, CreditCard, CheckCircle2, XCircle, ShoppingBag, Truck, Calendar } from 'lucide-react'

export default async function AdminOrdersPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const adminClient = createAdminClient()
    const { data: orders, error } = await adminClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching orders:', error)
        return <div className="p-8 text-red-600">Erreur lors du chargement des commandes.</div>
    }

    // Calculate quick stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const paidOrders = orders.filter(o => o.status === 'paid').length;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Commandes</h1>
                    <p className="text-slate-500 mt-1">Suivez et gérez les commandes de vos clients.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                        <Truck className="w-4 h-4" />
                        <span className="font-medium">Étiquettes</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Commandes</p>
                        <p className="text-xl font-bold text-slate-900">{totalOrders}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">En Attente</p>
                        <p className="text-xl font-bold text-slate-900">{pendingOrders}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Payées</p>
                        <p className="text-xl font-bold text-slate-900">{paidOrders}</p>
                    </div>
                </div>
            </div>

            {/* Filters & Search Bar (Visual Only for now) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une commande, un client..."
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
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Commande</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map((order: Order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-slate-900 font-mono text-sm">
                                        #{order.id.slice(0, 8)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-slate-400" />
                                            {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-900 font-medium">
                                        {order.customer_details.firstName} {order.customer_details.lastName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${order.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                order.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    'bg-slate-50 text-slate-700 border-slate-100'
                                            }`}>
                                            {order.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> :
                                                order.status === 'pending' ? <Clock className="w-3 h-3" /> :
                                                    <XCircle className="w-3 h-3" />}
                                            {order.status === 'paid' ? 'Payé' :
                                                order.status === 'pending' ? 'En attente' : order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-serif text-slate-900 font-medium">
                                        {order.total.toFixed(2)} €
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                                        >
                                            <Eye className="w-3 h-3" />
                                            Détails
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                                            <p className="text-lg font-medium text-slate-900 mb-1">Aucune commande</p>
                                            <p className="text-sm">Les commandes apparaîtront ici une fois passées.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
