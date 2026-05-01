'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, Save, X, Globe, Map } from 'lucide-react'
import { saveCustomZone, deleteCustomZone } from '@/actions/shipping'
import { COUNTRIES, REGIONS } from '@/lib/countries'
import { motion, AnimatePresence } from 'framer-motion'

export type CustomZone = { id: string, name: string, countries: string[] }

export default function CustomZonesManager({ initialZones }: { initialZones: CustomZone[] }) {
    const [zones, setZones] = useState<CustomZone[]>(initialZones)
    const [editingZone, setEditingZone] = useState<CustomZone | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const handleSave = async () => {
        if (!editingZone || !editingZone.name.trim() || editingZone.countries.length === 0) return;
        setIsSaving(true);

        const result = await saveCustomZone(editingZone.id, editingZone.name, editingZone.countries);

        if (result.success) {
            window.location.reload(); 
        } else {
            alert("Erreur lors de la sauvegarde: " + result.error);
            setIsSaving(false);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Êtes-vous sûr ? Si cette zone est utilisée dans un profil, ce profil se rabattra sur la zone globale (EU/ROW).")) return;
        
        const result = await deleteCustomZone(id);
        if (result.success) {
            setZones(zones.filter(z => z.id !== id));
        } else {
            alert("Erreur: " + result.error);
        }
    }

    const toggleCountry = (code: string) => {
        if (!editingZone) return;
        const newCountries = editingZone.countries.includes(code)
            ? editingZone.countries.filter(c => c !== code)
            : [...editingZone.countries, code];
        setEditingZone({ ...editingZone, countries: newCountries });
    }

    const filteredCountries = COUNTRIES.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (editingZone) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-8"
            >
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-indigo-50/30">
                    <h2 className="text-xl font-serif text-slate-900 flex items-center gap-2">
                        <Map className="w-5 h-5 text-indigo-500" />
                        {editingZone.id ? 'Modifier la zone' : 'Nouvelle zone personnalisée'}
                    </h2>
                    <button onClick={() => setEditingZone(null)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nom de la zone</label>
                        <input 
                            type="text" 
                            value={editingZone.name}
                            onChange={e => setEditingZone({...editingZone, name: e.target.value})}
                            placeholder="Ex: Afrique du Nord, DOM-TOM, Amérique du Sud..." 
                            className="w-full max-w-md px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 font-medium"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <label className="block text-sm font-medium text-slate-700">Pays inclus ({editingZone.countries.length})</label>
                            <input 
                                type="text"
                                placeholder="Rechercher un pays..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                            <div className="max-h-60 overflow-y-auto p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {filteredCountries.map(country => {
                                    const isSelected = editingZone.countries.includes(country.code);
                                    return (
                                        <label 
                                            key={country.code} 
                                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors text-sm font-medium select-none ${isSelected ? 'bg-indigo-100 text-indigo-900 border border-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'}`}
                                        >
                                            <input 
                                                type="checkbox" 
                                                checked={isSelected}
                                                onChange={() => toggleCountry(country.code)}
                                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                            />
                                            <span className="truncate" title={country.name}>{country.name}</span>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
                    <button 
                        onClick={() => setEditingZone(null)}
                        className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving || !editingZone.name || editingZone.countries.length === 0}
                        className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20"
                    >
                        {isSaving ? <Save className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Enregistrer la zone
                    </button>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-serif text-slate-900">Zones Personnalisées</h2>
                    <p className="text-sm text-slate-500 mt-1">Créez vos propres regroupements de pays (ex: Afrique du Nord, DOM-TOM).</p>
                </div>
                <button 
                    onClick={() => {
                        setSearchTerm('');
                        setEditingZone({ id: '', name: '', countries: [] });
                    }}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl font-medium transition-colors border border-indigo-100"
                >
                    <Plus className="w-4 h-4" />
                    Créer une zone
                </button>
            </div>

            {zones.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-slate-500 text-sm">
                    <Map className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    Aucune zone personnalisée. Vous pouvez en créer une pour grouper des pays.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {zones.map(zone => (
                        <div key={zone.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start group">
                            <div>
                                <h3 className="font-medium text-slate-900">{zone.name}</h3>
                                <p className="text-xs text-slate-500 mt-1">{zone.countries.length} pays inclus</p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setEditingZone(zone);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(zone.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
