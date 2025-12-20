import 'server-only'
import type { Locale } from './i18n-config'

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
    fr: () => import('./messages/fr.json').then((module) => module.default),
    en: () => import('./messages/en.json').then((module) => module.default),
    es: () => import('./messages/es.json').then((module) => module.default),
    ar: () => import('./messages/ar.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]?.() ?? dictionaries.fr()
