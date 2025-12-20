'use client'

import { updateProduct } from '@/actions/products'
import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import ProductVariantsForm, { Variant } from '@/components/admin/ProductVariantsForm'
import MediaManager from '@/components/admin/MediaManager'

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
    const [newImages, setNewImages] = useState<File[]>([])
    const [videoUrl, setVideoUrl] = useState<string | null>(product.video_url || null)

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

        // Append kept images (in their new order)
        formData.append('kept_images', JSON.stringify(images))

        // Append new images
        newImages.forEach(file => {
            formData.append('new_images', file)
        })

        // Append video URL
        if (videoUrl) {
            formData.append('video_url', videoUrl)
        }

        // Append video file
        if (videoFile) {
            formData.append('video_file', videoFile)
        }

        try {
            const result = await updateProduct(product.id, formData)
            if (result && !result.success) {
                toast.error(result.message || "Erreur lors de la mise à jour")
            } else {
                toast.success("Produit mis à jour avec succès")
            }
        } catch (error) {
            console.error(error)
            toast.error("Une erreur inattendue est survenue")
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

                    {/* Media Section */}
                    <MediaManager
                        images={images}
                        setImages={setImages}
                        videoUrl={videoUrl}
                        setVideoUrl={setVideoUrl}
                        videoFile={videoFile}
                        setVideoFile={setVideoFile}
                        newImages={newImages}
                        setNewImages={setNewImages}
                        onDeleteImage={handleDeleteClick}
                    />

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
