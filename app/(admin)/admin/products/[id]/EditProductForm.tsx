'use client'

import { updateProduct } from '@/actions/products'
import { useState } from 'react'
import Image from 'next/image'

export default function EditProductForm({ product }: { product: any }) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        try {
            await updateProduct(product.id, formData)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Alternative wrapper for action prop if needed
    const handleAction = async (formData: FormData) => {
        await updateProduct(product.id, formData)
    }

    return (
        <form action={handleAction} className="space-y-6">
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
                        Stock
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
                    <option value="Autre">Autre</option>
                    <option value="Sacs">Sacs</option>
                    <option value="Mobilier">Mobilier</option>
                    <option value="Luminaires">Luminaires</option>
                    <option value="Rangement">Rangement</option>
                    <option value="Tissus">Tissus</option>
                </select>
            </div>

            <div>
                <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-1">
                    Image
                </label>

                {product.images?.[0] && (
                    <div className="mb-4 relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
                        <Image
                            src={product.images[0]}
                            alt="Current product image"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="space-y-4">
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                    />
                    <p className="text-xs text-slate-500">
                        Laissez vide pour conserver l'image actuelle.
                    </p>

                    <div className="pt-2 border-t border-slate-100">
                        <label htmlFor="image_url" className="block text-xs font-medium text-slate-500 mb-1">
                            Ou remplacer par URL externe
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

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                    Enregistrer les modifications
                </button>
            </div>
        </form>
    )
}
