'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Reorder } from 'framer-motion'
import { toast } from 'sonner'

interface MediaManagerProps {
    images: string[]
    setImages: (images: string[]) => void
    videoUrl: string | null
    setVideoUrl: (url: string | null) => void
    videoFile: File | null
    setVideoFile: (file: File | null) => void
    newImages: File[]
    setNewImages: (files: File[]) => void
    onDeleteImage: (img: string) => void
}

export default function MediaManager({
    images,
    setImages,
    videoUrl,
    setVideoUrl,
    videoFile,
    setVideoFile,
    newImages,
    setNewImages,
    onDeleteImage
}: MediaManagerProps) {
    const [previewUrls, setPreviewUrls] = useState<string[]>([])

    // Handle file selection for new images
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setNewImages([...newImages, ...files])

            // Create previews
            const newPreviews = files.map(file => URL.createObjectURL(file))
            setPreviewUrls([...previewUrls, ...newPreviews])
        }
    }

    // Handle removing a new image (not yet saved)
    const removeNewImage = (index: number) => {
        const updatedFiles = [...newImages]
        updatedFiles.splice(index, 1)
        setNewImages(updatedFiles)

        const updatedPreviews = [...previewUrls]
        URL.revokeObjectURL(updatedPreviews[index]) // Cleanup
        updatedPreviews.splice(index, 1)
        setPreviewUrls(updatedPreviews)
    }

    // Handle video URL change
    const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVideoUrl(e.target.value)
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                    Images du produit
                </label>
                <p className="text-xs text-slate-500 mb-4">
                    Glissez et déposez les images pour les réorganiser. La première image sera l'image principale.
                </p>

                {/* Existing Images Reordering */}
                {images.length > 0 && (
                    <Reorder.Group axis="y" values={images} onReorder={setImages} className="space-y-2 mb-6">
                        {images.map((img) => (
                            <Reorder.Item key={img} value={img} className="flex items-center gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm cursor-move">
                                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-slate-100">
                                    <Image
                                        src={img}
                                        alt="Product image"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 truncate text-xs text-slate-500">
                                    {img.split('/').pop()}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onDeleteImage(img)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                )}

                {/* New Images Preview */}
                {previewUrls.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-medium text-slate-700 mb-2">Nouvelles images (à ajouter) :</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {previewUrls.map((url, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                    <Image
                                        src={url}
                                        alt={`New image ${idx}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(idx)}
                                        className="absolute top-1 right-1 bg-white/90 text-red-600 p-1 rounded-full shadow-sm hover:bg-red-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add New Images */}
                <div className="mt-4">
                    <label className="block w-full cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            <span className="text-sm text-slate-500">Cliquez pour ajouter des images</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Video Section */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                    Vidéo du produit (Optionnel)
                </label>

                <div className="space-y-4">
                    {/* URL Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-700">Option 1 : Lien externe (YouTube, Vimeo...)</label>
                        <input
                            type="url"
                            name="video_url"
                            placeholder="https://..."
                            value={videoUrl || ''}
                            onChange={handleVideoUrlChange}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-2 text-xs text-slate-500">OU</span>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-700">Option 2 : Téléverser une vidéo (MP4, WebM...)</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setVideoFile(e.target.files[0])
                                    // Clear URL if file is selected to avoid confusion
                                    setVideoUrl(null)
                                }
                            }}
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-slate-50 file:text-slate-700
                                hover:file:bg-slate-100
                            "
                        />
                        {videoFile && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Fichier sélectionné : {videoFile.name}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
