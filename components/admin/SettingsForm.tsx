'use client'

import { useState } from 'react'
import { updateSetting } from '@/actions/settings'
import { toast } from 'sonner'

interface SettingsFormProps {
    initialAnnouncement: {
        text: string
        isActive: boolean
    }
}

export default function SettingsForm({ initialAnnouncement }: SettingsFormProps) {
    const [announcement, setAnnouncement] = useState(initialAnnouncement)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const result = await updateSetting('announcement', announcement)

        if (result.success) {
            toast.success('Paramètres mis à jour !')
        } else {
            toast.error(result.message)
        }
        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <div>
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
                            id="isActive"
                            checked={announcement.isActive}
                            onChange={(e) => setAnnouncement({ ...announcement, isActive: e.target.checked })}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <label htmlFor="isActive" className="text-sm text-slate-700">Afficher la barre d'annonce</label>
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
