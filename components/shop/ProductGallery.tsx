'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ProductGallery({ images, title }: { images: { url: string, altText: string | null }[], title: string }) {
    const [selectedImage, setSelectedImage] = useState(images[0])

    if (!images || images.length === 0) return null

    return (
        <div className="space-y-4 lg:sticky lg:top-24 h-fit">
            <div className="relative aspect-square bg-stone-50 rounded-2xl overflow-hidden shadow-sm">
                {selectedImage ? (
                    <Image
                        src={selectedImage.url}
                        alt={selectedImage.altText || title}
                        fill
                        className="object-cover transition-all duration-500 hover:scale-105"
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <span className="text-4xl">📷</span>
                    </div>
                )}
            </div>

            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(image)}
                            className={`relative aspect-square bg-stone-50 rounded-xl overflow-hidden cursor-pointer transition-all ${selectedImage.url === image.url
                                    ? 'ring-2 ring-slate-900 ring-offset-2'
                                    : 'hover:opacity-80'
                                }`}
                        >
                            <Image
                                src={image.url}
                                alt={image.altText || `${title} - Image ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 25vw, 12.5vw"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
