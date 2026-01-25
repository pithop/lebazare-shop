import React from 'react';

interface StoreSchemaProps {
    storeName: string;
    url: string;
    logoUrl: string;
    description: string;
    aggregateRating?: {
        ratingValue: number;
        reviewCount: number;
    };
}

export const StoreSchema: React.FC<StoreSchemaProps> = ({
    storeName,
    url,
    logoUrl,
    description,
    aggregateRating
}) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Store",
        "@id": `${url}#store`,
        "name": storeName,
        "url": url,
        "logo": logoUrl,
        "description": description,
        "image": logoUrl,
        "priceRange": "€€",
        "telephone": "+33972213899",
        "email": "contact@lebazare.fr",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Aix-en-Provence",
            "postalCode": "13100",
            "addressCountry": "FR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "43.5297",
            "longitude": "5.4474"
        },
        "paymentAccepted": ["Carte Bancaire", "Visa", "Mastercard", "Apple Pay", "Google Pay"],
        "currenciesAccepted": "EUR",
        "returnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "FR",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 14,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/ReturnFeesCustomerResponsibility"
        },
        "sameAs": [
            "https://www.instagram.com/lebazare.fr",
            "https://www.facebook.com/lebazare.fr",
            "https://www.pinterest.fr/lebazare"
        ],
        ...(aggregateRating && aggregateRating.reviewCount > 0 ? {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": aggregateRating.ratingValue,
                "reviewCount": aggregateRating.reviewCount
            }
        } : {})
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

