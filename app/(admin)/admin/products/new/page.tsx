'use client'

import { createProduct } from '@/actions/products'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import ProductVariantsForm, { Variant } from '@/components/admin/ProductVariantsForm'
import MediaManager from '@/components/admin/MediaManager'

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [variants, setVariants] = useState<Variant[]>([])
    const [newImages, setNewImages] = useState<File[]>([])
    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const [videoFile, setVideoFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        // Append variants as JSON
        if (variants.length > 0) {
            formData.append('variants', JSON.stringify(variants))
        }

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
            await createProduct(formData)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    /*
    const [analyzing, setAnalyzing] = useState(false)

    const handleAIAnalysis = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setAnalyzing(true)
        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await fetch('/api/ai/analyze-product-image', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) throw new Error('Analysis failed')

            const data = await response.json()

            // Update form fields
            const titleInput = document.getElementById('title') as HTMLInputElement
            const descInput = document.getElementById('description') as HTMLTextAreaElement
            const priceInput = document.getElementById('price') as HTMLInputElement
            const categoryInput = document.getElementById('category') as HTMLSelectElement

            if (titleInput) titleInput.value = data.title
            if (descInput) descInput.value = data.description
            if (priceInput) priceInput.value = data.price
            if (categoryInput) categoryInput.value = data.category

            // Add the image to the media manager
            setNewImages(prev => [...prev, file])

            // toast.success("Produit rempli avec l'IA !") // toast not imported yet
        } catch (error) {
            console.error(error)
            // toast.error("Erreur lors de l'analyse IA")
        } finally {
            setAnalyzing(false)
        }
    }
    */

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <form onSubmit={handleSubmit}>
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 -mx-8 px-8 py-4 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/products" className="text-slate-500 hover:text-slate-800">
                            ← Retour
                        </Link>
                        <h1 className="text-2xl font-serif text-slate-900">Nouveau Produit</h1>

                        {/* AI Button (Disabled for now) */}
                        {/* <div className="relative">
                            <input
                                type="file"
                                id="ai-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAIAnalysis}
                                disabled={analyzing}
                            />
                            <label
                                htmlFor="ai-upload"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${analyzing
                                    ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                    }`}
                            >
                                {analyzing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyse en cours...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6.375 9a.75.75 0 01.75.75v2.25H9.375a.75.75 0 010 1.5H7.125v2.25a.75.75 0 01-1.5 0v-2.25H3.375a.75.75 0 010-1.5h2.25V9.75A.75.75 0 016.375 9z" clipRule="evenodd" />
                                        </svg>
                                        Remplir avec l'IA
                                    </>
                                )}
                            </label>
                        </div> */}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Création...
                            </>
                        ) : (
                            'Créer le produit'
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* General Info Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
                            <h2 className="text-lg font-medium text-slate-900">Informations de base</h2>

                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                                    Titre du produit
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                    placeholder="Ex: Tapis Berbère Beni Ouarain"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={6}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Décrivez votre produit en détail..."
                                />
                            </div>
                        </div>

                        {/* Media Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-lg font-medium text-slate-900 mb-6">Médias</h2>
                            <MediaManager
                                images={[]}
                                setImages={() => { }}
                                videoUrl={videoUrl}
                                setVideoUrl={setVideoUrl}
                                videoFile={videoFile}
                                setVideoFile={setVideoFile}
                                newImages={newImages}
                                setNewImages={setNewImages}
                                onDeleteImage={() => { }}
                            />
                        </div>

                        {/* Variants Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-lg font-medium text-slate-900 mb-6">Variantes</h2>
                            <ProductVariantsForm variants={variants} setVariants={setVariants} />
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-8">
                        {/* Status & Organization Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
                            <h2 className="text-lg font-medium text-slate-900">Organisation</h2>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                                    Catégorie
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="decoration">Décoration</option>
                                    <option value="mobilier">Mobilier</option>
                                    <option value="luminaires">Luminaires</option>
                                    <option value="art-de-la-table">Art de la table</option>
                                    <option value="tapis">Tapis</option>
                                    <option value="accessoires">Accessoires</option>
                                </select>
                            </div>
                        </div>

                        {/* Pricing & Inventory Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
                            <h2 className="text-lg font-medium text-slate-900">Prix et Stock</h2>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
                                    Prix (€)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        step="0.01"
                                        required
                                        className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">
                                    Stock Global
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    required
                                    defaultValue={1}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                />
                                <p className="text-xs text-slate-500 mt-1">Sera ignoré si des variantes sont définies.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
