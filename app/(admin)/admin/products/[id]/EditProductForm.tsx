'use client'

import { updateProduct } from '@/actions/products'
import { useState } from 'react'
import Image from 'next/image'
import ProductVariantsForm, { Variant } from '@/components/admin/ProductVariantsForm'

export default function EditProductForm({ product }: { product: any }) {
    const [loading, setLoading] = useState(false)

    // Map existing variants to the format expected by the form
    const initialVariants: Variant[] = product.product_variants?.map((v: any) => ({
        id: v.id,
        name: v.name,
        price: v.price || 0,
        stock: v.stock,
        attributes: v.attributes || {}
    })) || []

    const [variants, setVariants] = useState<Variant[]>(initialVariants)

    const [images, setImages] = useState<string[]>(product.images || [])
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [imageToDelete, setImageToDelete] = useState<string | null>(null)

    const handleDeleteClick = (img: string) => {
        setImageToDelete(img)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        if (imageToDelete) {
            setImages(images.filter(i => i !== imageToDelete))
            setImageToDelete(null)
            setShowDeleteModal(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        // Append variants as JSON
        if (variants.length > 0) {
            formData.append('variants', JSON.stringify(variants))
        }

        // Append kept images
        formData.append('kept_images', JSON.stringify(images))

        try {
            await updateProduct(product.id, formData)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Custom Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-medium text-slate-900 mb-2">Supprimer l'image ?</h3>
                        <p className="text-slate-500 mb-6">Êtes-vous sûr de vouloir supprimer cette image ? Cette action sera enregistrée lors de la sauvegarde du produit.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                    <h2 className="text-xl font-medium text-slate-900 border-b border-slate-100 pb-2">Informations Générales</h2>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                            Titre
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            defaultValue={product.title}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            defaultValue={product.description}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
                                Prix (€)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                step="0.01"
                                defaultValue={product.price}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">
                                Stock Global
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                defaultValue={product.stock}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                            Catégorie
                        </label>
                        <select
                            id="category"
                            name="category"
                            defaultValue={product.category || 'Autre'}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                        >
                            <option value="decoration">Décoration</option>
                            <option value="mobilier">Mobilier</option>
                            <option value="luminaires">Luminaires</option>
                            <option value="art-de-la-table">Art de la table</option>
                            <option value="tapis">Tapis</option>
                            <option value="accessoires">Accessoires</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>

                    {/* Images Section */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Images
                        </label>

                        {images.length > 0 && (
                            <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                        <Image
                                            src={img}
                                            alt={`Product image ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteClick(img)}
                                            className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-4">
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                multiple
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            />
                            <p className="text-xs text-slate-500">
                                Sélectionnez de nouvelles images pour les AJOUTER.
                            </p>

                            {/* URL Input */}
                            <div className="pt-2 border-t border-slate-100">
                                <label htmlFor="image_url" className="block text-xs font-medium text-slate-500 mb-1">
                                    Ou ajouter par URL externe
                                </label>
                                <input
                                    type="url"
                                    id="image_url"
                                    name="image_url"
                                    placeholder="https://..."
                                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-medium text-slate-900 border-b border-slate-100 pb-2">Variantes</h2>
                    <ProductVariantsForm variants={variants} setVariants={setVariants} />
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </form>
        </>
    )
}
