'use client'

import { useState } from 'react'
import { updateSetting } from '@/actions/settings'
import { toast } from 'sonner'

interface SettingsFormProps {
    initialAnnouncement: {
        text: string
        isActive: boolean
    }
    initialShippingRules: {
        freeShippingThreshold: number
        isActive: boolean
    }
}

export default function SettingsForm({ initialAnnouncement, initialShippingRules }: SettingsFormProps) {
    const [announcement, setAnnouncement] = useState(initialAnnouncement)
    const [shippingRules, setShippingRules] = useState(initialShippingRules)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const resultAnnouncement = await updateSetting('announcement', announcement)
        const resultShipping = await updateSetting('shipping_rules', shippingRules)

        if (resultAnnouncement.success && resultShipping.success) {
            toast.success('Paramètres mis à jour !')
        } else {
            toast.error('Erreur lors de la mise à jour')
        }
        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            {/* Announcement Bar */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-serif text-slate-800 mb-6">Barre d'annonce</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                        <input
                            type="text"
                            value={announcement.text}
                            onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                            className="w-full rounded-md border-slate-200 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                            placeholder="Ex: Livraison offerte dès 100€"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActiveAnnouncement"
                            checked={announcement.isActive}
                            onChange={(e) => setAnnouncement({ ...announcement, isActive: e.target.checked })}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <label htmlFor="isActiveAnnouncement" className="text-sm text-slate-700">Afficher la barre d'annonce</label>
                    </div>
                </div>
            </div>

            {/* Shipping Rules */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-serif text-slate-800 mb-6">Livraison</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Seuil de livraison gratuite (€)</label>
                        <input
                            type="number"
                            value={shippingRules.freeShippingThreshold}
                            onChange={(e) => setShippingRules({ ...shippingRules, freeShippingThreshold: parseInt(e.target.value) || 0 })}
                            className="w-full rounded-md border-slate-200 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                            placeholder="Ex: 100"
                        />
                        <p className="text-xs text-slate-500 mt-1">Le montant du panier doit être supérieur ou égal à ce montant pour bénéficier de la livraison gratuite.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActiveShipping"
                            checked={shippingRules.isActive}
                            onChange={(e) => setShippingRules({ ...shippingRules, isActive: e.target.checked })}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <label htmlFor="isActiveShipping" className="text-sm text-slate-700">Activer la livraison gratuite</label>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    )
}
