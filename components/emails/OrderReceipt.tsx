import React from 'react';
import { Order } from '@/lib/types';

interface ExtendedOrder extends Order {
    items: {
        product_id: string;
        quantity: number;
        price: number;
    }[];
    shipping_details: {
        address: {
            line1: string;
            line2?: string;
            city: string;
            postal_code: string;
            country: string;
        };
    };
    customer_code?: string; // Customer tracking code
}

interface OrderReceiptProps {
    order: ExtendedOrder;
    products: any[]; // Using any for now to avoid strict type issues with enriched product data
}

export const OrderReceipt: React.FC<OrderReceiptProps> = ({ order, products }) => {
    const { customer_details, shipping_details, items, total, shipping_total_cents, tax_total_cents, customer_code } = order;

    // Helper to format price
    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const subtotal = (total - (shipping_total_cents || 0) / 100);
    const shipping = (shipping_total_cents || 0) / 100;
    const tax = (tax_total_cents || 0) / 100;

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
                    <p style={{ margin: '16px 0 0 0', fontSize: '14px', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '1px' }}>Confirmation de commande</p>
                </div>

                {/* Body */}
                <div style={{ padding: '40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '400', margin: '0 0 16px 0', color: colors.text, fontFamily: fonts.serif }}>Merci, {customer_details.firstName} !</h2>
                        <p style={{ fontSize: '16px', color: colors.textSecondary, margin: '0' }}>
                            Nous avons bien reçu votre commande.
                        </p>
                        <div style={{ marginTop: '24px', display: 'inline-block', padding: '8px 16px', backgroundColor: colors.background, borderRadius: '4px', fontSize: '14px', color: colors.text }}>
                            Commande <span style={{ fontWeight: '600', color: colors.primary }}>#{order.id.slice(0, 8)}</span>
                        </div>
                    </div>

                    {/* Customer Code Card */}
                    {customer_code && (
                        <div style={{
                            marginBottom: '32px',
                            padding: '24px',
                            backgroundColor: '#FEF3C7',
                            border: '2px dashed #F59E0B',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#92400E', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                                Votre Code Client
                            </p>
                            <p style={{
                                margin: '0 0 16px 0',
                                fontSize: '32px',
                                fontWeight: '700',
                                color: colors.primary,
                                fontFamily: 'monospace',
                                letterSpacing: '3px'
                            }}>
                                {customer_code}
                            </p>
                            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#78350F' }}>
                                Conservez ce code pour suivre toutes vos commandes chez LeBazare.
                            </p>
                            <a
                                href={`https://www.lebazare.fr/fr/mon-compte?code=${customer_code}`}
                                style={{
                                    display: 'inline-block',
                                    padding: '12px 24px',
                                    backgroundColor: colors.primary,
                                    color: '#FFFFFF',
                                    textDecoration: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                Suivre ma commande
                            </a>
                        </div>
                    )}

                    {/* Items */}
                    <div style={{ marginBottom: '32px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {items.map((item, index) => {
                                    const product = products.find(p => p.id === item.product_id);
                                    const image = product?.images?.edges?.[0]?.node?.url || '';

                                    return (
                                        <tr key={index} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                            <td style={{ padding: '20px 0', width: '80px' }}>
                                                {image && (
                                                    <img src={image} alt={product?.title} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px', backgroundColor: colors.background }} />
                                                )}
                                            </td>
                                            <td style={{ padding: '20px 16px', verticalAlign: 'middle' }}>
                                                <p style={{ margin: '0', fontWeight: '500', fontSize: '15px', color: colors.text, fontFamily: fonts.serif }}>{product?.title || 'Produit'}</p>
                                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: colors.textSecondary }}>Qté: {item.quantity}</p>
                                            </td>
                                            <td style={{ padding: '20px 0', textAlign: 'right', verticalAlign: 'middle', fontSize: '15px', fontWeight: '500', color: colors.text }}>
                                                {formatPrice(item.price * item.quantity)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div style={{ paddingBottom: '32px', borderBottom: `1px solid ${colors.border}` }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '6px 0', color: colors.textSecondary, fontSize: '14px' }}>Sous-total</td>
                                    <td style={{ padding: '6px 0', textAlign: 'right', color: colors.text, fontSize: '14px' }}>{formatPrice(subtotal)}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '6px 0', color: colors.textSecondary, fontSize: '14px' }}>Livraison</td>
                                    <td style={{ padding: '6px 0', textAlign: 'right', color: colors.text, fontSize: '14px' }}>
                                        {shipping === 0 ? 'Offerte' : formatPrice(shipping)}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '6px 0', color: '#9CA3AF', fontSize: '12px' }}>Dont TVA</td>
                                    <td style={{ padding: '6px 0', textAlign: 'right', color: '#9CA3AF', fontSize: '12px' }}>{formatPrice(tax)}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '20px 0 0 0', fontWeight: '400', fontSize: '18px', color: colors.text, fontFamily: fonts.serif }}>Total</td>
                                    <td style={{ padding: '20px 0 0 0', textAlign: 'right', fontWeight: '600', fontSize: '20px', color: colors.primary, fontFamily: fonts.serif }}>{formatPrice(total)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Customer Info */}
                    <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '48%' }}>
                            <h3 style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0', color: colors.textSecondary }}>Adresse de livraison</h3>
                            <p style={{ margin: '0', fontSize: '14px', color: colors.text, lineHeight: '1.6' }}>
                                {customer_details.firstName} {customer_details.lastName}<br />
                                {shipping_details.address.line1}<br />
                                {shipping_details.address.line2 && <>{shipping_details.address.line2}<br /></>}
                                {shipping_details.address.postal_code} {shipping_details.address.city}<br />
                                {shipping_details.address.country}
                            </p>
                        </div>
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
