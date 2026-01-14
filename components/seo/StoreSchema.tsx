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
        "name": storeName,
        "url": url,
        "logo": logoUrl,
        "description": description,
        "image": logoUrl,
        "priceRange": "€€",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "FR"
        },
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
