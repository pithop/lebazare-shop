'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Save, X, Search, Globe, Package, Loader2, Check } from 'lucide-react'
import { saveShippingProfile, deleteShippingProfile, searchProductsForShipping, getProductsForProfile } from '@/actions/shipping'
import { COUNTRIES, REGIONS } from '@/lib/countries'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

type Destination = { id?: string, zone: string, base_price: number, additional_price: number }
type Profile = { id: string, name: string, shipping_profile_destinations: any[] }
type ProductLight = { id: string, title: string, images: string[], shipping_profile_id: string | null, price?: number }
type CustomZone = { id: string, name: string, countries: string[] }

export default function ShippingProfilesManager({ initialProfiles, customZones }: { initialProfiles: Profile[], customZones: CustomZone[] }) {
    const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)
    
    // Edit state
    const [editingProfile, setEditingProfile] = useState<{ id: string | null, name: string, destinations: Destination[] } | null>(null)
    const [assignedProducts, setAssignedProducts] = useState<ProductLight[]>([])
    
    // Search state
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<ProductLight[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isLoadingProducts, setIsLoadingProducts] = useState(false)

    const [isSaving, setIsSaving] = useState(false)

    // Load products when opening a profile
    useEffect(() => {
        if (editingProfile?.id) {
            setIsLoadingProducts(true)
            getProductsForProfile(editingProfile.id).then(products => {
                setAssignedProducts(products as any)
                setIsLoadingProducts(false)
            })
        } else {
            setAssignedProducts([])
        }
    }, [editingProfile?.id])

    // Search effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim().length >= 2) {
                setIsSearching(true)
                searchProductsForShipping(searchQuery).then(results => {
                    setSearchResults(results as any)
                    setIsSearching(false)
                })
            } else {
                setSearchResults([])
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery])

    const handleSave = async () => {
        if (!editingProfile || !editingProfile.name.trim()) return;
        setIsSaving(true);
        
        const productIds = assignedProducts.map(p => p.id);

        const result = await saveShippingProfile(
            editingProfile.id,
            editingProfile.name,
            editingProfile.destinations,
            productIds
        );

        if (result.success) {
            window.location.reload(); 
        } else {
            alert("Erreur lors de la sauvegarde: " + result.error);
            setIsSaving(false);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce profil ? Les produits liés utiliseront le calcul par défaut au poids.")) return;
        
        const result = await deleteShippingProfile(id);
        if (result.success) {
            setProfiles(profiles.filter(p => p.id !== id));
        } else {
            alert("Erreur: " + result.error);
        }
    }

    const toggleProductAssignment = (product: ProductLight) => {
        const isAssigned = assignedProducts.some(p => p.id === product.id);
        if (isAssigned) {
            setAssignedProducts(prev => prev.filter(p => p.id !== product.id));
        } else {
            setAssignedProducts(prev => [...prev, product]);
        }
    }

    // Modal UI
    if (editingProfile) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
            >
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-2xl font-serif text-slate-900">
                        {editingProfile.id ? 'Modifier le profil' : 'Nouveau profil de livraison'}
                    </h2>
                    <button onClick={() => setEditingProfile(null)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                    {/* Left Column: Profile Settings */}
                    <div className="flex-1 p-6 space-y-8 bg-white">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nom du profil</label>
                            <input 
                                type="text" 
                                value={editingProfile.name}
                                onChange={e => setEditingProfile({...editingProfile, name: e.target.value})}
                                placeholder="Ex: Livraison Meubles Lourds" 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-900 font-medium"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-medium text-slate-700">Tarifs par zone</label>
                                <button 
                                    onClick={() => setEditingProfile({
                                        ...editingProfile, 
                                        destinations: [...editingProfile.destinations, { zone: 'FR', base_price: 0, additional_price: 0 }]
                                    })}
                                    className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 flex items-center gap-1.5 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Ajouter une zone
                                </button>
                            </div>
                            
                            {editingProfile.destinations.length === 0 ? (
                                <div className="text-center py-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-slate-500 text-sm">
                                    <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    Aucune zone configurée. Cliquez sur "Ajouter une zone".
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {editingProfile.destinations.map((dest, idx) => (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                key={idx} 
                                                className="flex flex-col sm:flex-row gap-3 sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
                                            >
                                                <div className="flex-1">
                                                    <select 
                                                        value={dest.zone}
                                                        onChange={e => {
                                                            const newDest = [...editingProfile.destinations];
                                                            newDest[idx].zone = e.target.value;
                                                            setEditingProfile({...editingProfile, destinations: newDest});
                                                        }}
                                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-medium text-slate-700 focus:ring-2 focus:ring-slate-900"
                                                    >
                                                        <optgroup label="Zones Globales">
                                                            {REGIONS.map(r => (
                                                                <option key={r.code} value={r.code}>{r.name}</option>
                                                            ))}
                                                        </optgroup>
                                                        {customZones && customZones.length > 0 && (
                                                            <optgroup label="Vos Zones Personnalisées">
                                                                {customZones.map(z => (
                                                                    <option key={z.id} value={z.id}>{z.name}</option>
                                                                ))}
                                                            </optgroup>
                                                        )}
                                                        <optgroup label="Pays Spécifiques">
                                                            {COUNTRIES.map(c => (
                                                                <option key={c.code} value={c.code}>{c.name}</option>
                                                            ))}
                                                        </optgroup>
                                                    </select>
                                                </div>
                                                <div className="flex gap-3 items-center">
                                                    <div className="w-28 relative">
                                                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1 block">1er Article</label>
                                                        <div className="relative">
                                                            <input 
                                                                type="number" step="0.01" min="0"
                                                                value={dest.base_price}
                                                                onChange={e => {
                                                                    const newDest = [...editingProfile.destinations];
                                                                    newDest[idx].base_price = parseFloat(e.target.value) || 0;
                                                                    setEditingProfile({...editingProfile, destinations: newDest});
                                                                }}
                                                                className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-900"
                                                            />
                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">€</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-28 relative">
                                                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1 block">Art. Sup.</label>
                                                        <div className="relative">
                                                            <input 
                                                                type="number" step="0.01" min="0"
                                                                value={dest.additional_price}
                                                                onChange={e => {
                                                                    const newDest = [...editingProfile.destinations];
                                                                    newDest[idx].additional_price = parseFloat(e.target.value) || 0;
                                                                    setEditingProfile({...editingProfile, destinations: newDest});
                                                                }}
                                                                className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-900"
                                                            />
                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">€</span>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            const newDest = [...editingProfile.destinations];
                                                            newDest.splice(idx, 1);
                                                            setEditingProfile({...editingProfile, destinations: newDest});
                                                        }}
                                                        className="mt-5 p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Product Assignment */}
                    <div className="w-full lg:w-96 bg-slate-50/30 flex flex-col max-h-[600px]">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-medium text-slate-900 flex items-center gap-2 mb-4">
                                <Package className="w-4 h-4 text-slate-400" />
                                Produits associés ({assignedProducts.length})
                            </h3>
                            
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher pour assigner..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all"
                                />
                                {isSearching && <Loader2 className="w-4 h-4 text-slate-300 absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />}
                            </div>

                            {/* Search Results Dropdown-like area */}
                            <AnimatePresence>
                                {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-center text-sm text-slate-500"
                                    >
                                        Aucun produit trouvé pour "{searchQuery}"
                                    </motion.div>
                                ) : searchResults.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
                                    >
                                        {searchResults.map(result => {
                                            const isAssigned = assignedProducts.some(p => p.id === result.id);
                                            const imgUrl = result.images?.[0];
                                            return (
                                                <button
                                                    key={result.id}
                                                    onClick={() => toggleProductAssignment(result)}
                                                    className={`w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${isAssigned ? 'bg-slate-50/50' : ''}`}
                                                >
                                                    <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden relative shrink-0">
                                                        {imgUrl && <Image src={imgUrl} alt="" fill className="object-cover" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-xs font-medium text-slate-700 line-clamp-1">{result.title}</span>
                                                        {result.price !== undefined && (
                                                            <span className="text-[10px] text-slate-400 font-medium">{result.price.toFixed(2)}€</span>
                                                        )}
                                                    </div>
                                                    {isAssigned && <Check className="w-4 h-4 text-green-500 shrink-0" />}
                                                </button>
                                            )
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Assigned Products List */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {isLoadingProducts ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                                </div>
                            ) : assignedProducts.length === 0 ? (
                                <div className="text-center py-12 text-slate-400 text-sm">
                                    Aucun produit n'est associé à ce profil.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <AnimatePresence>
                                        {assignedProducts.map(product => {
                                            const imgUrl = product.images?.[0];
                                            return (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    key={product.id} 
                                                    className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100 shadow-sm group hover:border-red-100 transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden relative shrink-0">
                                                        {imgUrl && <Image src={imgUrl} alt="" fill className="object-cover" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-sm font-medium text-slate-700 line-clamp-1">{product.title}</span>
                                                        {product.price !== undefined && (
                                                            <span className="text-[11px] text-slate-400 font-medium">{product.price.toFixed(2)}€</span>
                                                        )}
                                                    </div>
                                                    <button 
                                                        onClick={() => toggleProductAssignment(product)}
                                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                        title="Retirer ce produit"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </motion.div>
                                            )
                                        })}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
                    <button 
                        onClick={() => setEditingProfile(null)}
                        className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving || !editingProfile.name}
                        className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-900/20"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </motion.div>
        )
    }

    // Grid UI
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button 
                    onClick={() => setEditingProfile({ id: null, name: '', destinations: [{ zone: 'FR', base_price: 8, additional_price: 1 }] })}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-900/20 font-medium transition-all hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    Créer un profil
                </button>
            </div>

            {profiles.length === 0 ? (
                <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-2xl shadow-sm">
                    <Globe className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-1">Aucun profil de livraison configuré</h3>
                    <p className="text-slate-500">L'algorithme de secours au poids volumétrique est actuellement utilisé.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profiles.map(profile => (
                        <motion.div 
                            whileHover={{ y: -4 }}
                            key={profile.id} 
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group"
                        >
                            <div className="p-6 border-b border-slate-50 flex justify-between items-start">
                                <div>
                                    <h3 className="font-serif text-lg font-medium text-slate-900 mb-1">{profile.name}</h3>
                                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                        <Globe className="w-3 h-3" />
                                        {profile.shipping_profile_destinations.length} Zone(s) configurée(s)
                                    </p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(profile.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50/50 space-y-3">
                                                {profile.shipping_profile_destinations.length === 0 ? (
                                                    <p className="text-sm text-slate-500 italic">Aucun tarif défini</p>
                                                ) : (
                                                    profile.shipping_profile_destinations.slice(0, 3).map(d => {
                                                        const zoneName = customZones.find(z => z.id === d.zone)?.name || REGIONS.find(r => r.code === d.zone)?.name || COUNTRIES.find(c => c.code === d.zone)?.name || d.zone;
                                                        return (
                                                            <div key={d.id} className="flex justify-between items-center text-sm">
                                                <span className="font-medium text-slate-600">{zoneName}</span>
                                                <div className="text-right">
                                                    <span className="text-slate-900 font-bold">{(d.base_price_cents / 100).toFixed(2)}€</span>
                                                    {d.additional_price_cents > 0 && (
                                                        <span className="text-slate-400 text-xs ml-1 font-medium">(+{(d.additional_price_cents / 100).toFixed(2)}€)</span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                                {profile.shipping_profile_destinations.length > 3 && (
                                    <p className="text-xs text-slate-400 text-center pt-2 font-medium">
                                        + {profile.shipping_profile_destinations.length - 3} autres zones
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
