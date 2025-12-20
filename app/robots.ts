import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.lebazare.fr'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/checkout/', '/compte/', '/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
