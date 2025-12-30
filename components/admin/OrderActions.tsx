'use client'

import { useState } from 'react'
import { resendOrderConfirmation } from '@/actions/admin-email'
import { toast } from 'sonner'
import Link from 'next/link'

export default function OrderActions({ orderId }: { orderId: string }) {
    const [isResending, setIsResending] = useState(false)

    const handleResendEmail = async () => {
        if (!confirm('Voulez-vous renvoyer l\'email de confirmation au client ?')) return

        setIsResending(true)
        const result = await resendOrderConfirmation(orderId)
        setIsResending(false)

        if (result.success) {
            toast.success('Email renvoyé avec succès !')
        } else {
            toast.error(result.message || 'Erreur lors de l\'envoi')
        }
    }

    return (
        <div className="flex gap-3">
            <Link
                href={`/admin/orders/${orderId}/print`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimer BL
            </Link>

            <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {isResending ? 'Envoi...' : 'Renvoyer Email'}
            </button>
        </div>
    )
}
