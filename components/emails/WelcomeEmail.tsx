import React from 'react';

interface WelcomeEmailProps {
    firstName: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ firstName }) => {
    // Premium Design Tokens
    const colors = {
        background: '#F9F5F0', // Beige/Off-white
        surface: '#FFFFFF',
        primary: '#C86B48', // Terracotta
        text: '#1A1A1A', // Dark Text
        textSecondary: '#6B7280',
        border: '#E5E7EB',
    };

    const fonts = {
        serif: "'Playfair Display', Georgia, serif",
        sans: "'Inter', Helvetica, Arial, sans-serif",
    };

    return (
        <div style={{ fontFamily: fonts.sans, backgroundColor: colors.background, padding: '40px 0', color: colors.text, lineHeight: '1.6' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: colors.surface, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}>

                {/* Header */}
                <div style={{ padding: '48px 40px', textAlign: 'center', borderBottom: `1px solid ${colors.border}` }}>
                    <h1 style={{ color: colors.primary, margin: '0', fontSize: '32px', fontWeight: '400', letterSpacing: '-0.5px', fontFamily: fonts.serif }}>LeBazare</h1>
                    <p style={{ margin: '16px 0 0 0', fontSize: '14px', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '1px' }}>Bienvenue</p>
                </div>

                {/* Body */}
                <div style={{ padding: '40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '400', margin: '0 0 16px 0', color: colors.text, fontFamily: fonts.serif }}>Bienvenue dans la famille, {firstName} !</h2>
                        <p style={{ fontSize: '16px', color: colors.textSecondary, margin: '0' }}>
                            Merci de rejoindre LeBazare.
                        </p>
                    </div>

                    <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                        <p style={{ fontSize: '15px', color: colors.text, marginBottom: '24px' }}>
                            Nous sommes ravis de vous compter parmi nous. LeBazare est né d'une passion pour l'artisanat authentique et les objets qui ont une âme.
                        </p>
                        <p style={{ fontSize: '15px', color: colors.text }}>
                            Vous serez le premier informé de nos nouvelles collections et de nos offres exclusives.
                        </p>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <a href="https://www.lebazare.fr" style={{ display: 'inline-block', backgroundColor: colors.primary, color: '#FFFFFF', padding: '14px 32px', borderRadius: '4px', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>
                            Découvrir la collection
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ backgroundColor: colors.background, padding: '32px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: colors.textSecondary }}>
                        Une question ? Contactez-nous à <a href="mailto:contact@lebazare.fr" style={{ color: colors.primary, textDecoration: 'none', fontWeight: '500' }}>contact@lebazare.fr</a>
                    </p>
                    <div style={{ margin: '20px 0', height: '1px', backgroundColor: '#E5E7EB', width: '40px', display: 'inline-block' }}></div>
                    <p style={{ margin: '0', fontSize: '12px', color: '#9CA3AF' }}>
                        © {new Date().getFullYear()} LeBazare. Tous droits réservés.
                    </p>
                </div>
            </div>
        </div>
    );
};
