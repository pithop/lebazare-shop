'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ProductGallery({ images, title, videoUrl }: { images: { url: string, altText: string | null }[], title: string, videoUrl?: string | null }) {
    const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'video', url: string, alt?: string }>(
        { type: 'image', url: images[0]?.url || '', alt: images[0]?.altText || title }
    )

    // Initialize with first image
    // If we want video to be first if present? Usually images first.

    const allMedia = [
        ...images.map(img => ({ type: 'image' as const, url: img.url, alt: img.altText || undefined })),
        ...(videoUrl ? [{ type: 'video' as const, url: videoUrl, alt: `${title} - Video` }] : [])
    ]

    if (allMedia.length === 0) return null

    const isVideo = (url: string) => {
        return url.includes('.mp4') || url.includes('.webm') || url.includes('blob:')
    }

    return (
        <div className="space-y-4 lg:sticky lg:top-24 h-fit">
            <div className="relative aspect-square bg-stone-50 rounded-2xl overflow-hidden shadow-sm">
                {selectedMedia.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                        <video
                            src={selectedMedia.url}
                            controls
                            className="w-full h-full object-contain"
                            autoPlay
                            muted
                            loop
                        />
                    </div>
                ) : selectedMedia.url ? (
                    <Image
                        src={selectedMedia.url}
                        alt={selectedMedia.alt || title}
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

            {allMedia.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {allMedia.map((media, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedMedia(media)}
                            className={`relative aspect-square bg-stone-50 rounded-xl overflow-hidden cursor-pointer transition-all ${selectedMedia.url === media.url
                                ? 'ring-2 ring-slate-900 ring-offset-2'
                                : 'hover:opacity-80'
                                }`}
                        >
                            {media.type === 'video' ? (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                </div>
                            ) : (
                                <Image
                                    src={media.url}
                                    alt={media.alt || `${title} - Image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
