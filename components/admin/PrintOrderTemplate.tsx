'use client'

import { useEffect } from 'react'

export default function PrintOrderTemplate({ order }: { order: any }) {
    useEffect(() => {
        window.print()
    }, [])

    // Parse customer details safely
    let customerDetails = order.customer_details;
    if (typeof customerDetails === 'string') {
        try { customerDetails = JSON.parse(customerDetails); } catch (e) { }
    }

    return (
        <div className="bg-white min-h-screen p-8 text-black print:p-0">
            <style jsx global>{`
                @media print {
                    @page { margin: 0; }
                    body { margin: 1.6cm; }
                }
            `}</style>

            <div className="max-w-3xl mx-auto border border-gray-200 p-8 print:border-0 print:p-0">
                {/* Header */}
                <div className="flex justify-between items-start mb-12 border-b border-gray-200 pb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold mb-2">LeBazare</h1>
                        <p className="text-sm text-gray-500">Bon de Livraison</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg">Commande #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Expéditeur</h3>
                        <p className="text-sm leading-relaxed">
                            <strong>LeBazare</strong><br />
                            [Votre Adresse]<br />
                            [Code Postal, Ville]<br />
                            France
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Destinataire</h3>
                        <p className="text-sm leading-relaxed">
                            <strong>{customerDetails.firstName} {customerDetails.lastName}</strong><br />
                            {customerDetails.address}<br />
                            {customerDetails.postalCode} {customerDetails.city}<br />
                            {customerDetails.country}
                        </p>
                    </div>
                </div>

                {/* Items */}
                <div className="mb-12">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Produit</th>
                                <th className="py-3 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Qté</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.order_items.map((item: any) => (
                                <tr key={item.id}>
                                    <td className="py-4">
                                        <p className="font-medium">{item.products?.title || 'Produit inconnu'}</p>
                                        {item.product_variants && (
                                            <p className="text-sm text-gray-500">Variante: {item.product_variants.name}</p>
                                        )}
                                    </td>
                                    <td className="py-4 text-right font-medium">{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
                    <p>Merci de votre confiance !</p>
                    <p className="mt-2">LeBazare - contact@lebazare.fr</p>
                </div>
            </div>
        </div>
    )
}
