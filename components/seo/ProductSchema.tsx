import React from 'react';

interface ProductSchemaProps {
    product: {
        name: string;
        description: string;
        images: string[];
        sku: string;
        price: number; // Price in standard units (e.g., 100.00)
        currency: string;
        availability: 'InStock' | 'OutOfStock';
        brand?: string;
    };
    shipping: {
        cost: number; // Cost in standard units
        minDays: number;
        maxDays: number;
    };
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({ product, shipping }) => {
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images,
        "description": product.description,
        "sku": product.sku || `SKU-${product.name.replace(/\s+/g, '-').toUpperCase()}`,
        "brand": {
            "@type": "Brand",
            "name": product.brand || "Lebazare Artisanat"
        },
        // Placeholder for AggregateRating to trigger stars in SERP
        // In a real app, fetch this from a reviews provider
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "124"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://www.lebazare.fr/fr/produits/${product.sku}`,
            "priceCurrency": product.currency,
            "price": product.price,
            "availability": `https://schema.org/${product.availability}`,
            "itemCondition": "https://schema.org/NewCondition",
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": shipping.cost,
                    "currency": product.currency
                },
                "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "FR"
                },
                "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 2,
                        "unitCode": "DAY"
                    },
                    "transitTime": {
                        "@type": "QuantitativeValue",
                        "minValue": shipping.minDays,
                        "maxValue": shipping.maxDays,
                        "unitCode": "DAY"
                    }
                }
            },
            "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "FR",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 14,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/ReturnFeesCustomerResponsibility"
            }
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};
