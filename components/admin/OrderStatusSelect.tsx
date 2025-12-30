'use client'

import { useState } from 'react'
import { updateOrderStatus } from '@/actions/admin-orders'

const STATUSES = [
    { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: 'Payée', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'En préparation', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Expédiée', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Livrée', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Annulée', color: 'bg-red-100 text-red-800' },
]

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus)
    const [isLoading, setIsLoading] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        let reason: string | undefined = undefined;

        if (newStatus === 'cancelled') {
            const input = window.prompt("Motif de l'annulation (sera envoyé au client) :", "Rupture de stock");
            if (input === null) return; // User clicked Cancel in the prompt
            reason = input;
        }

        setIsLoading(true)
        const result = await updateOrderStatus(orderId, newStatus, reason)
        if (result.success) {
            setStatus(newStatus)
        } else {
            alert('Erreur lors de la mise à jour du statut')
        }
        setIsLoading(false)
    }

    const currentStatusConfig = STATUSES.find(s => s.value === status) || STATUSES[0]

    return (
        <div className="relative">
            <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isLoading}
                className={`appearance-none px-4 py-2 pr-8 rounded-full text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ${currentStatusConfig.color}`}
            >
                {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                        {s.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    )
}
