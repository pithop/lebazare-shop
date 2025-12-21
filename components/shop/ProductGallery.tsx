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
        <div className="space-y-4">
            {/* Mobile: Carousel with Scroll Snap */}
            <div className="lg:hidden relative group">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                    {allMedia.map((media, index) => (
                        <div key={index} className="relative w-[85vw] flex-shrink-0 snap-center aspect-[4/5] bg-stone-50 rounded-xl overflow-hidden">
                            {media.type === 'video' ? (
                                <video
                                    src={media.url}
                                    controls
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <Image
                                    src={media.url}
                                    alt={media.alt || `${title} - ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="85vw"
                                />
                            )}
                        </div>
                    ))}
                </div>
                {/* Scroll hint/indicator could be added here */}
            </div>

            {/* Desktop: Vertical Grid / Masonry-ish */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
                {allMedia.map((media, index) => (
                    <div
                        key={index}
                        className={`relative bg-stone-50 rounded-xl overflow-hidden cursor-pointer group ${index === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-[3/4]'
                            }`}
                        onClick={() => setSelectedMedia(media)} // Optional: Open lightbox? For now just static grid
                    >
                        {media.type === 'video' ? (
                            <video
                                src={media.url}
                                controls
                                className="w-full h-full object-cover"
                                muted
                                loop
                            />
                        ) : (
                            <Image
                                src={media.url}
                                alt={media.alt || `${title} - ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes={index === 0 ? "50vw" : "25vw"}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
