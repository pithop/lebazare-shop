import { getAllProducts } from '@/lib/products';
import { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

export async function GET() {
    const baseUrl = 'https://www.lebazare.fr';
    const products = await getAllProducts(1000);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>LeBazare</title>
<link>${baseUrl}</link>
<description>Artisanat Authentique et Décoration</description>
${products.map((product) => {
        const image = product.images.edges[0]?.node.url || '';
        const price = product.priceRange.minVariantPrice.amount;
        const currency = product.priceRange.minVariantPrice.currencyCode;

        // Weight in kg for shipping
        const weightKg = (product.weight_grams || 1000) / 1000;
        const origin = product.origin_country || 'MA';

        // Determine shipping based on origin
        const shippingPrice = origin === 'MA' ? '25.00' : '8.00';
        const shippingCountry = 'FR'; // Main target country

        // Get description without HTML tags
        const cleanDescription = (product.description || product.title)
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .substring(0, 5000); // Google limit

        return `
<item>
<g:id>${escapeXml(product.id)}</g:id>
<g:title>${escapeXml(product.title.substring(0, 150))}</g:title>
<g:description>${escapeXml(cleanDescription)}</g:description>
<g:link>${baseUrl}/fr/produits/${escapeXml(product.handle)}</g:link>
<g:image_link>${escapeXml(image)}</g:image_link>
<g:condition>new</g:condition>
<g:availability>${product.variants.edges[0]?.node.availableForSale ? 'in stock' : 'out of stock'}</g:availability>
<g:price>${price} ${currency}</g:price>
<g:brand>LeBazare</g:brand>
<g:google_product_category>Home &amp; Garden &gt; Decor</g:google_product_category>
<g:product_type>Artisanat &gt; Décoration</g:product_type>
<g:shipping>
<g:country>${shippingCountry}</g:country>
<g:service>Standard</g:service>
<g:price>${shippingPrice} ${currency}</g:price>
</g:shipping>
<g:shipping_weight>${weightKg} kg</g:shipping_weight>
<g:identifier_exists>no</g:identifier_exists>
<g:mpn>${escapeXml(product.id)}</g:mpn>
</item>`;
    }).join('')}
</channel>
</rss>`

        ;

    return new Response(xml, {
        headers: {
            'Content-Type': 'text/xml; charset=UTF-8',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
    });
}

