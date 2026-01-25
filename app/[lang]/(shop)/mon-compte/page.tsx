import { getOrdersByCode } from '@/lib/customer-codes';
import Link from 'next/link';
import Image from 'next/image';

// Status translation (client-side utility)
function getStatusLabel(status: string): { label: string; color: string } {
    const statusMap: Record<string, { label: string; color: string }> = {
        pending: { label: 'En attente de paiement', color: 'yellow' },
        paid: { label: 'Payée', color: 'green' },
        processing: { label: 'En préparation', color: 'blue' },
        shipped: { label: 'Expédiée', color: 'purple' },
        delivered: { label: 'Livrée', color: 'green' },
        cancelled: { label: 'Annulée', color: 'red' },
        refunded: { label: 'Remboursée', color: 'gray' },
    };
    return statusMap[status] || { label: status, color: 'gray' };
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
    return {
        title: 'Mon Compte - LeBazare',
        description: 'Suivez vos commandes LeBazare avec votre code client.',
        alternates: {
            canonical: `/${params.lang}/mon-compte`,
        },
    };
}

async function OrdersList({ code }: { code: string }) {
    const result = await getOrdersByCode(code);

    if (!result.success || !result.orders) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-dark-text mb-2">Code invalide</h3>
                <p className="text-dark-text/60">{result.error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif text-dark-text">Vos Commandes</h2>
                <span className="text-sm text-dark-text/60">{result.orders.length} commande(s)</span>
            </div>

            {result.orders.map((order: any) => {
                const status = getStatusLabel(order.status);
                const orderDate = new Date(order.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

                return (
                    <div key={order.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                        {/* Order Header */}
                        <div className="p-5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-dark-text/60">Commande du {orderDate}</p>
                                <p className="font-mono text-xs text-dark-text/40 mt-1">#{order.id.slice(0, 8)}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color === 'green' ? 'bg-green-100 text-green-700' :
                                    status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                        status.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                            status.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                                                status.color === 'red' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                    }`}>
                                    {status.label}
                                </span>
                                <span className="font-medium text-dark-text">{order.total.toFixed(2)} €</span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-5 space-y-4">
                            {order.order_items?.map((item: any) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-16 h-16 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.product?.images?.[0] && (
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.product?.title || 'Produit'}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/produits/${item.product?.slug || ''}`}
                                            className="font-medium text-dark-text hover:text-terracotta transition-colors line-clamp-1"
                                        >
                                            {item.product?.title || 'Produit'}
                                        </Link>
                                        <p className="text-sm text-dark-text/60">Qté: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-dark-text">{(item.price * item.quantity).toFixed(2)} €</p>
                                </div>
                            ))}
                        </div>

                        {/* Shipping Info */}
                        {order.customer_details && (
                            <div className="px-5 py-4 bg-stone-50 border-t border-stone-100">
                                <p className="text-sm text-dark-text/60">
                                    Livraison : {order.customer_details.address}, {order.customer_details.postalCode} {order.customer_details.city}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default async function MonComptePage({
    searchParams
}: {
    searchParams: { code?: string }
}) {
    const code = searchParams.code?.trim();

    return (
        <div className="min-h-[70vh] bg-stone-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-serif text-center text-dark-text mb-2">Mon Compte</h1>
                <p className="text-center text-dark-text/60 mb-8">
                    Entrez votre code client pour voir vos commandes
                </p>

                {/* Code Input Form */}
                <form className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 mb-8">
                    <label className="block text-sm font-medium text-dark-text mb-2">
                        Code Client
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            name="code"
                            defaultValue={code || ''}
                            placeholder="LBZ-XXXX"
                            className="flex-1 px-4 py-3 rounded-lg border border-stone-200 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-colors font-mono uppercase text-center text-lg tracking-widest"
                            maxLength={8}
                            pattern="LBZ-[A-Z0-9]{4}"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-terracotta text-white rounded-lg font-medium hover:bg-terracotta/90 transition-colors"
                        >
                            Voir mes commandes
                        </button>
                    </div>
                    <p className="text-xs text-dark-text/50 mt-2">
                        Votre code client se trouve dans l'email de confirmation de commande.
                    </p>
                </form>

                {/* Orders List */}
                {code && <OrdersList code={code} />}

                {/* Help Section */}
                {!code && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-beige rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-serif text-dark-text mb-3">Suivez vos commandes</h3>
                        <p className="text-dark-text/60 max-w-md mx-auto mb-6">
                            Lors de chaque commande, vous recevez un code client unique par email.
                            Ce code vous permet de suivre toutes vos commandes passées chez LeBazare.
                        </p>
                        <Link
                            href="/contact"
                            className="text-terracotta hover:underline font-medium"
                        >
                            Code perdu ? Contactez-nous
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
