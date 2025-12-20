import { getAllProducts } from '@/lib/products'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.lebazare.fr'

    // Get all products
    const products = await getAllProducts(1000)

    const productUrls = products.map((product) => ({
        url: `${baseUrl}/fr/produits/${product.handle}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const staticRoutes = [
        '',
        '/produits',
        '/a-propos',
        '/contact',
        '/faq',
        '/livraison',
        '/mentions-legales',
        '/cgv',
    ]

    const staticUrls = staticRoutes.map((route) => ({
        url: `${baseUrl}/fr${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' as const : 'monthly' as const,
        priority: route === '' ? 1 : 0.5,
    }))

    return [
        ...staticUrls,
        ...productUrls,
    ]
}
