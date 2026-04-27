'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import { saveShippingProfile, deleteShippingProfile } from '@/actions/shipping'

type Destination = { id?: string, zone: string, base_price: number, additional_price: number }
type Profile = { id: string, name: string, shipping_profile_destinations: any[] }

export default function ShippingProfilesManager({ initialProfiles }: { initialProfiles: Profile[] }) {
    const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)
    const [editingProfile, setEditingProfile] = useState<{ id: string | null, name: string, destinations: Destination[] } | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        if (!editingProfile || !editingProfile.name.trim()) return;
        setIsLoading(true);
        
        const result = await saveShippingProfile(
            editingProfile.id,
            editingProfile.name,
            editingProfile.destinations
        );

        if (result.success) {
            window.location.reload(); // Quick refresh to get new state from server
        } else {
            alert("Erreur lors de la sauvegarde: " + result.error);
            setIsLoading(false);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce profil ? Les produits liés utiliseront le calcul par défaut.")) return;
        
        const result = await deleteShippingProfile(id);
        if (result.success) {
            setProfiles(profiles.filter(p => p.id !== id));
        } else {
            alert("Erreur: " + result.error);
        }
    }

    if (editingProfile) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium text-slate-900">
                        {editingProfile.id ? 'Modifier le profil' : 'Nouveau profil de livraison'}
                    </h2>
                    <button onClick={() => setEditingProfile(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom du profil</label>
                        <input 
                            type="text" 
                            value={editingProfile.name}
                            onChange={e => setEditingProfile({...editingProfile, name: e.target.value})}
                            placeholder="Ex: Livraison Meubles Lourds" 
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-700">Tarifs par zone</label>
                            <button 
                                onClick={() => setEditingProfile({
                                    ...editingProfile, 
                                    destinations: [...editingProfile.destinations, { zone: 'FR', base_price: 0, additional_price: 0 }]
                                })}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Ajouter une zone
                            </button>
                        </div>
                        
                        {editingProfile.destinations.length === 0 && (
                            <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-slate-500 text-sm">
                                Aucune zone configurée. Cliquez sur "Ajouter une zone".
                            </div>
                        )}

                        <div className="space-y-3">
                            {editingProfile.destinations.map((dest, idx) => (
                                <div key={idx} className="flex gap-3 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <div className="flex-1">
                                        <select 
                                            value={dest.zone}
                                            onChange={e => {
                                                const newDest = [...editingProfile.destinations];
                                                newDest[idx].zone = e.target.value;
                                                setEditingProfile({...editingProfile, destinations: newDest});
                                            }}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md outline-none text-sm"
                                        >
                                            <option value="FR">France</option>
                                            <option value="EU">Union Européenne</option>
                                            <option value="ROW">Reste du Monde</option>
                                            <option value="BE">Belgique</option>
                                            <option value="CH">Suisse</option>
                                        </select>
                                    </div>
                                    <div className="w-32">
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                min="0"
                                                value={dest.base_price}
                                                onChange={e => {
                                                    const newDest = [...editingProfile.destinations];
                                                    newDest[idx].base_price = parseFloat(e.target.value) || 0;
                                                    setEditingProfile({...editingProfile, destinations: newDest});
                                                }}
                                                className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-md outline-none text-sm"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">€</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1">1er article</p>
                                    </div>
                                    <div className="w-32">
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                min="0"
                                                value={dest.additional_price}
                                                onChange={e => {
                                                    const newDest = [...editingProfile.destinations];
                                                    newDest[idx].additional_price = parseFloat(e.target.value) || 0;
                                                    setEditingProfile({...editingProfile, destinations: newDest});
                                                }}
                                                className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-md outline-none text-sm"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">€</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1">Article sup.</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const newDest = [...editingProfile.destinations];
                                            newDest.splice(idx, 1);
                                            setEditingProfile({...editingProfile, destinations: newDest});
                                        }}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button 
                            onClick={() => setEditingProfile(null)}
                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                        >
                            Annuler
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isLoading || !editingProfile.name}
                            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 font-medium"
                        >
                            <Save className="w-4 h-4" />
                            {isLoading ? 'Enregistrement...' : 'Enregistrer le profil'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button 
                    onClick={() => setEditingProfile({ id: null, name: '', destinations: [{ zone: 'FR', base_price: 8, additional_price: 1 }] })}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 font-medium transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Créer un profil
                </button>
            </div>

            {profiles.length === 0 ? (
                <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-xl">
                    <p className="text-slate-500">Aucun profil de livraison configuré.</p>
                    <p className="text-sm text-slate-400 mt-1">L'algorithme de secours (au poids) est actuellement utilisé.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profiles.map(profile => (
                        <div key={profile.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:border-slate-300 transition-colors">
                            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-900 truncate pr-4">{profile.name}</h3>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => setEditingProfile({
                                            id: profile.id,
                                            name: profile.name,
                                            destinations: profile.shipping_profile_destinations.map(d => ({
                                                id: d.id,
                                                zone: d.zone,
                                                base_price: d.base_price_cents / 100,
                                                additional_price: d.additional_price_cents / 100
                                            }))
                                        })}
                                        className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(profile.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 bg-slate-50/50 space-y-3">
                                {profile.shipping_profile_destinations.length === 0 ? (
                                    <p className="text-sm text-slate-500 italic">Aucune zone configurée</p>
                                ) : (
                                    profile.shipping_profile_destinations.map(d => (
                                        <div key={d.id} className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">{d.zone}</span>
                                            <div className="text-right">
                                                <span className="text-slate-900 font-medium">{(d.base_price_cents / 100).toFixed(2)}€</span>
                                                {d.additional_price_cents > 0 && (
                                                    <span className="text-slate-500 text-xs ml-1">(+{ (d.additional_price_cents / 100).toFixed(2) }€/sup)</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
