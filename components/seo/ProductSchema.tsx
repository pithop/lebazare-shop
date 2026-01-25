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
        material?: string; // e.g., "Doum (paille naturelle)", "Bois d'eucalyptus"
        pattern?: string; // e.g., "Tressé main", "Motif berbère"
        category?: string; // e.g., "Luminaires", "Mobilier"
        aggregateRating?: {
            ratingValue: string | number;
            reviewCount: string | number;
        };
        reviews?: Array<{
            author: string;
            date: string;
            text: string;
            rating: number;
        }>;
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
        // Material (important for Google Merchant)
        ...(product.material ? { "material": product.material } : {}),
        // Pattern (for artisanal products)
        ...(product.pattern ? { "pattern": product.pattern } : {}),
        // Category
        ...(product.category ? { "category": product.category } : {}),
        "brand": {
            "@type": "Brand",
            "name": product.brand || "Lebazare Artisanat"
        },
        // AggregateRating (Dynamic or Placeholder)
        ...(product.aggregateRating ? {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": product.aggregateRating.ratingValue,
                "reviewCount": product.aggregateRating.reviewCount
            }
        } : {}),
        // Individual Reviews
        ...(product.reviews && product.reviews.length > 0 ? {
            "review": product.reviews.map(review => ({
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": review.rating,
                    "bestRating": "5"
                },
                "author": {
                    "@type": "Person",
                    "name": review.author
                },
                "datePublished": review.date,
                "reviewBody": review.text
            }))
        } : {}),
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
            "priceSpecification": [
                {
                    "@type": "UnitPriceSpecification",
                    "priceType": "https://schema.org/ListPrice",
                    "price": (product.price / 0.8).toFixed(2),
                    "priceCurrency": product.currency
                },
                {
                    "@type": "UnitPriceSpecification",
                    "priceType": "https://schema.org/SalePrice",
                    "price": product.price.toFixed(2),
                    "priceCurrency": product.currency,
                    "validFrom": new Date().toISOString().split('T')[0],
                    "validThrough": new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
                }
            ],
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
