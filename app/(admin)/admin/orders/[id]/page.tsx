import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import OrderStatusSelect from '@/components/admin/OrderStatusSelect'
import OrderShippingForm from '@/components/admin/OrderShippingForm'
import OrderActions from '@/components/admin/OrderActions'

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const adminClient = createAdminClient()

    const { data: order, error } = await adminClient
        .from('orders')
        .select(`
      *,
      order_items (
        *,
        products (
          title,
          images
        ),
        product_variants (
          name,
          attributes
        )
      )
    `)
        .eq('id', params.id)
        .single()

    if (error || !order) {
        notFound()
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="text-slate-500 hover:text-slate-800">
                        ← Retour
                    </Link>
                    <h1 className="text-3xl font-serif text-slate-800">Commande #{order.id.slice(0, 8)}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <OrderActions orderId={order.id} />
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-medium mb-4">Articles</h2>
                        <div className="divide-y divide-slate-100">
                            {order.order_items.map((item: any) => (
                                <div key={item.id} className="py-4 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-24 bg-stone-50 rounded-md overflow-hidden relative border border-slate-200">
                                            {/* Ideally use Next Image here if we had the URL handy */}
                                            {item.products?.images?.[0] && (
                                                <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {item.products?.title || 'Produit supprimé'}
                                            </p>
                                            {item.product_variants && (
                                                <p className="text-sm text-slate-500">
                                                    Variante: {item.product_variants.name}
                                                </p>
                                            )}
                                            <p className="text-sm text-slate-500">Qté: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-slate-900">{(item.price * item.quantity).toFixed(2)} €</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-100 mt-4 pt-4 space-y-2">
                            <div className="flex justify-between text-slate-600">
                                <span>Sous-total</span>
                                <span>{(order.total - (order.shipping_total_cents || 0) / 100).toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Livraison</span>
                                <span className={order.shipping_total_cents === 0 ? "text-green-600 font-medium" : ""}>
                                    {order.shipping_total_cents ? (order.shipping_total_cents / 100).toFixed(2) + ' €' : 'Gratuit'}
                                </span>
                            </div>
                            {order.tax_total_cents > 0 && (
                                <div className="flex justify-between text-slate-500 text-sm">
                                    <span>Dont TVA (inclus)</span>
                                    <span>{(order.tax_total_cents / 100).toFixed(2)} €</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                                <span className="font-medium text-slate-700">Total</span>
                                <span className="text-xl font-bold text-slate-900">{order.total.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Status */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-medium mb-4">Historique</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-2 h-2 mt-2 rounded-full bg-slate-300"></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Commande créée</p>
                                    <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
                                </div>
                            </div>
                            {order.shipping_info?.shippedAt && (
                                <div className="flex gap-4">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500"></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Commande expédiée</p>
                                        <p className="text-xs text-slate-500">{new Date(order.shipping_info.shippedAt).toLocaleString('fr-FR')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Customer */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-medium mb-4">Client</h2>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p className="font-medium text-slate-900">
                                {order.customer_details.firstName} {order.customer_details.lastName}
                            </p>
                            <p>{order.customer_details.email}</p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-medium mb-4">Adresse de livraison</h2>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>{order.customer_details.address}</p>
                            <p>{order.customer_details.postalCode} {order.customer_details.city}</p>
                            <p>{order.customer_details.country}</p>
                        </div>
                    </div>

                    {/* Shipping Management */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-medium mb-4">Expédition</h2>
                        <OrderShippingForm orderId={order.id} existingShippingInfo={order.shipping_info} />
                    </div>
                </div>
            </div>
        </div>
    )
}
