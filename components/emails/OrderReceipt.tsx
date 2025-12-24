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
}

interface OrderReceiptProps {
    order: ExtendedOrder;
    products: any[]; // Using any for now to avoid strict type issues with enriched product data
}

export const OrderReceipt: React.FC<OrderReceiptProps> = ({ order, products }) => {
    const { customer_details, shipping_details, items, total, shipping_total_cents, tax_total_cents } = order;

    // Helper to format price
    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const subtotal = (total - (shipping_total_cents || 0) / 100);
    const shipping = (shipping_total_cents || 0) / 100;
    const tax = (tax_total_cents || 0) / 100;

    return (
        <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#f9fafb', padding: '40px 0', color: '#1f2937' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                {/* Header */}
                <div style={{ backgroundColor: '#111827', padding: '32px', textAlign: 'center' }}>
                    <h1 style={{ color: '#ffffff', margin: '0', fontSize: '24px', fontWeight: '300', letterSpacing: '1px', fontFamily: 'Georgia, serif' }}>LeBazare</h1>
                </div>

                {/* Body */}
                <div style={{ padding: '32px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0', color: '#111827' }}>Merci pour votre commande !</h2>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Thank you for your order!</p>
                        <p style={{ marginTop: '16px', fontSize: '16px', color: '#374151' }}>
                            Commande <span style={{ fontWeight: 'bold' }}>#{order.id.slice(0, 8)}</span>
                        </p>
                    </div>

                    {/* Items */}
                    <div style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '24px 0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {items.map((item, index) => {
                                    const product = products.find(p => p.id === item.product_id);
                                    const image = product?.images?.edges?.[0]?.node?.url || '';

                                    return (
                                        <tr key={index} style={{ borderBottom: index !== items.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                            <td style={{ padding: '12px 0', width: '60px' }}>
                                                {image && (
                                                    <img src={image} alt={item.product_id} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#f3f4f6' }} />
                                                )}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <p style={{ margin: '0', fontWeight: '500', fontSize: '14px', color: '#111827' }}>{product?.title || 'Produit'}</p>
                                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>Qté: {item.quantity}</p>
                                            </td>
                                            <td style={{ padding: '12px 0', textAlign: 'right', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                                                {formatPrice(item.price * item.quantity)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div style={{ padding: '24px 0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '4px 0', color: '#6b7280', fontSize: '14px' }}>Sous-total / Subtotal</td>
                                    <td style={{ padding: '4px 0', textAlign: 'right', color: '#374151', fontSize: '14px' }}>{formatPrice(subtotal)}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '4px 0', color: '#6b7280', fontSize: '14px' }}>Livraison / Shipping</td>
                                    <td style={{ padding: '4px 0', textAlign: 'right', color: '#374151', fontSize: '14px' }}>
                                        {shipping === 0 ? 'Offerte' : formatPrice(shipping)}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '4px 0', color: '#9ca3af', fontSize: '12px' }}>Dont TVA / VAT included</td>
                                    <td style={{ padding: '4px 0', textAlign: 'right', color: '#9ca3af', fontSize: '12px' }}>{formatPrice(tax)}</td>
                                </tr>
                                <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '16px 0 0 0', fontWeight: '700', fontSize: '16px', color: '#111827' }}>Total</td>
                                    <td style={{ padding: '16px 0 0 0', textAlign: 'right', fontWeight: '700', fontSize: '16px', color: '#111827' }}>{formatPrice(total)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Customer Info */}
                    <div style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '12px', marginTop: '8px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0', color: '#111827' }}>Informations de livraison</h3>
                        <p style={{ margin: '0', fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
                            {customer_details.firstName} {customer_details.lastName}<br />
                            {shipping_details.address.line1}<br />
                            {shipping_details.address.line2 && <>{shipping_details.address.line2}<br /></>}
                            {shipping_details.address.postal_code} {shipping_details.address.city}<br />
                            {shipping_details.address.country}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ backgroundColor: '#f3f4f6', padding: '24px', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>
                        Une question ? Répondez à cet email ou contactez-nous à <a href="mailto:contact@lebazare.fr" style={{ color: '#111827', textDecoration: 'underline' }}>contact@lebazare.fr</a>
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#9ca3af' }}>
                        © {new Date().getFullYear()} LeBazare. Tous droits réservés.
                    </p>
                </div>
            </div>
        </div>
    );
};
