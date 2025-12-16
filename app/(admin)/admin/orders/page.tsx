import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Order } from '@/lib/types'

export default async function AdminOrdersPage() {
    const supabase = createClient()
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching orders:', error)
        return <div className="p-8 text-red-600">Erreur lors du chargement des commandes.</div>
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-slate-800">Commandes</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-slate-500">N° Commande</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Date</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Client</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Statut</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Total</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map((order: Order) => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    #{order.id.slice(0, 8)}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {order.customer_details.firstName} {order.customer_details.lastName}
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
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        Voir détails
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    Aucune commande pour le moment.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
