'use client'

import { useState } from 'react'
import { updateOrderShipping } from '@/actions/admin-orders'

export default function OrderShippingForm({ orderId, existingShippingInfo }: { orderId: string, existingShippingInfo: any }) {
    const [trackingNumber, setTrackingNumber] = useState(existingShippingInfo?.trackingNumber || '')
    const [carrier, setCarrier] = useState(existingShippingInfo?.carrier || '')
    const [isLoading, setIsLoading] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const result = await updateOrderShipping(orderId, trackingNumber, carrier)
        if (result.success) {
            setIsSaved(true)
            setTimeout(() => setIsSaved(false), 3000)
        } else {
            alert('Erreur lors de la mise à jour')
        }
        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Transporteur</label>
                <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                    <option value="">Sélectionner...</option>
                    <option value="colissimo">Colissimo</option>
                    <option value="chronopost">Chronopost</option>
                    <option value="ups">UPS</option>
                    <option value="dhl">DHL</option>
                    <option value="mondial_relay">Mondial Relay</option>
                    <option value="autre">Autre</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Numéro de suivi</label>
                <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="ex: 6A..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
                {isLoading ? 'Enregistrement...' : isSaved ? 'Enregistré !' : 'Mettre à jour la livraison'}
            </button>
        </form>
    )
}
