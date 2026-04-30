'use client';

import { motion } from 'framer-motion';

export default function ProduitsLoading() {
  return (
    <div className="bg-beige min-h-screen bg-grain overflow-x-hidden">
      {/* Header Skeleton */}
      <header className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 md:px-12">
        <div className="max-w-[90vw] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 md:gap-24 border-b border-dark-text/10 pb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-[10vw] md:h-[8vw] w-[60vw] md:w-[40vw] rounded-md overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-r from-stone-200/60 via-stone-100/40 to-stone-200/60 animate-shimmer" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                className="h-[8vw] md:h-[6vw] w-[45vw] md:w-[30vw] mt-2 ml-[5vw] rounded-md overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-r from-terracotta/15 via-terracotta/5 to-terracotta/15 animate-shimmer" />
              </motion.div>
            </div>

            <div className="md:w-1/3 mb-2 space-y-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-2"
              >
                <div className="h-4 w-full rounded bg-stone-200/50 animate-shimmer" />
                <div className="h-4 w-5/6 rounded bg-stone-200/50 animate-shimmer" />
                <div className="h-4 w-3/4 rounded bg-stone-200/50 animate-shimmer" />
              </motion.div>
              <div className="mt-6 flex gap-4">
                <div className="h-3 w-16 rounded bg-stone-200/40 animate-shimmer" />
                <div className="h-3 w-2 rounded bg-stone-200/30" />
                <div className="h-3 w-24 rounded bg-stone-200/40 animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Products Grid Skeleton */}
      <main className="px-4 md:px-8 pb-32">
        <div className="max-w-[95vw] mx-auto">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-24">
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + index * 0.12,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className={`${index % 2 === 0 ? 'mt-0' : 'mt-12 md:mt-24'} break-inside-avoid mb-16`}
              >
                {/* Image Skeleton */}
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm bg-stone-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-200/60 via-stone-50/30 to-stone-200/60 animate-shimmer" />
                  {/* Subtle artisanal pattern hint */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-stone-300">
                        <path
                          d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 15V3"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* Text Skeleton */}
                <div className="pt-6 flex flex-col items-center text-center">
                  <div className="h-2 w-16 rounded-full bg-stone-200/40 mb-3 animate-shimmer" />
                  <div className="h-5 w-48 rounded bg-stone-200/50 mb-2 animate-shimmer" />
                  <div className="h-4 w-40 rounded bg-stone-200/50 mb-2 animate-shimmer" />
                  <div className="h-3 w-12 rounded bg-stone-200/40 animate-shimmer" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
