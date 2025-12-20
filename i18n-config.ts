export const i18n = {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'es', 'ar'],
} as const

export type Locale = (typeof i18n)['locales'][number]
