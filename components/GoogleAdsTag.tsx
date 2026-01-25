'use client';

import Script from 'next/script';

const GOOGLE_ADS_ID = 'AW-17854547850';

/**
 * Track a Google Ads purchase conversion
 * Call this function on the checkout success page after payment confirmation
 */
export const trackGoogleAdsPurchase = (transactionId: string, value: number, currency: string = 'EUR') => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
            'send_to': `${GOOGLE_ADS_ID}/purchase`,
            'value': value,
            'currency': currency,
            'transaction_id': transactionId,
        });
        console.log('Google Ads conversion tracked:', { transactionId, value, currency });
    }
};

export default function GoogleAdsTag() {
    return (
        <>
            {/* Google Consent Mode - Default to denied for GDPR compliance */}
            <Script
                id="google-consent-mode"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        
                        // Default consent state - denied until user accepts
                        gtag('consent', 'default', {
                            'ad_storage': 'denied',
                            'ad_user_data': 'denied',
                            'ad_personalization': 'denied',
                            'analytics_storage': 'denied',
                            'wait_for_update': 500
                        });
                    `,
                }}
            />

            {/* Google Tag (gtag.js) - Global Site Tag */}
            <Script
                id="google-ads-gtag"
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            />

            {/* Google Ads Configuration */}
            <Script
                id="google-ads-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GOOGLE_ADS_ID}', {
                            'allow_enhanced_conversions': true
                        });
                    `,
                }}
            />
        </>
    );
}

/**
 * Call this function when user accepts cookies/tracking
 * This updates the consent state to allow tracking
 */
export const updateGoogleConsent = (granted: boolean) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
            'ad_storage': granted ? 'granted' : 'denied',
            'ad_user_data': granted ? 'granted' : 'denied',
            'ad_personalization': granted ? 'granted' : 'denied',
            'analytics_storage': granted ? 'granted' : 'denied',
        });
        console.log('Google consent updated:', granted ? 'granted' : 'denied');
    }
};
