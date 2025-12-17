import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.lebazare.fr' // Replace with actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/checkout/', '/compte/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
