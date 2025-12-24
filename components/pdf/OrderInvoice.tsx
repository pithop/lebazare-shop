import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Order } from '@/lib/types';

// Define styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        paddingBottom: 20,
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    invoiceInfo: {
        textAlign: 'right',
    },
    invoiceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flexDirection: 'column',
        width: '45%',
    },
    label: {
        fontSize: 8,
        color: '#888888',
        textTransform: 'uppercase',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    text: {
        marginBottom: 3,
        lineHeight: 1.4,
    },
    table: {
        marginTop: 20,
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 8,
        marginBottom: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        paddingVertical: 8,
        alignItems: 'center',
    },
    colProduct: { width: '55%' },
    colQty: { width: '15%', textAlign: 'center' },
    colPrice: { width: '15%', textAlign: 'right' },
    colTotal: { width: '15%', textAlign: 'right' },

    totals: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        marginBottom: 5,
    },
    totalLabel: {
        color: '#666666',
    },
    grandTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#000000',
    },
    grandTotalText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        textAlign: 'center',
        color: '#888888',
        fontSize: 8,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: 20,
    },
});

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

interface OrderInvoiceProps {
    order: ExtendedOrder;
    products: any[];
}

export const OrderInvoice: React.FC<OrderInvoiceProps> = ({ order, products }) => {
    const { customer_details, shipping_details, items, total, shipping_total_cents, tax_total_cents } = order;

    const subtotal = (total - (shipping_total_cents || 0) / 100);
    const shipping = (shipping_total_cents || 0) / 100;
    const tax = (tax_total_cents || 0) / 100;

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.logo}>LEBAZARE</Text>
                        <Text style={[styles.text, { marginTop: 5 }]}>Artisanat Marocain</Text>
                        <Text style={styles.text}>contact@lebazare.fr</Text>
                        <Text style={styles.text}>www.lebazare.fr</Text>
                    </View>
                    <View style={styles.invoiceInfo}>
                        <Text style={styles.invoiceTitle}>FACTURE / INVOICE</Text>
                        <Text style={styles.text}>#{order.id.slice(0, 8).toUpperCase()}</Text>
                        <Text style={styles.text}>{formatDate(order.created_at)}</Text>
                    </View>
                </View>

                {/* Addresses */}
                <View style={[styles.row, styles.section]}>
                    <View style={styles.column}>
                        <Text style={styles.label}>Facturé à / Billed To</Text>
                        <Text style={styles.text}>{customer_details.firstName} {customer_details.lastName}</Text>
                        <Text style={styles.text}>{customer_details.email}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Livraison / Shipping</Text>
                        <Text style={styles.text}>{shipping_details.address.line1}</Text>
                        {shipping_details.address.line2 && <Text style={styles.text}>{shipping_details.address.line2}</Text>}
                        <Text style={styles.text}>{shipping_details.address.postal_code} {shipping_details.address.city}</Text>
                        <Text style={styles.text}>{shipping_details.address.country}</Text>
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colProduct, styles.label]}>Produit / Product</Text>
                        <Text style={[styles.colQty, styles.label]}>Qté</Text>
                        <Text style={[styles.colPrice, styles.label]}>Prix</Text>
                        <Text style={[styles.colTotal, styles.label]}>Total</Text>
                    </View>
                    {items.map((item, index) => {
                        const product = products.find(p => p.id === item.product_id);
                        // Handle both array of strings (DB) and Shopify-style object (Frontend types)
                        let image = '';
                        if (Array.isArray(product?.images)) {
                            image = product.images[0];
                        } else {
                            image = product?.images?.edges?.[0]?.node?.url || '';
                        }

                        return (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.colProduct}>{product?.title || 'Produit'}</Text>
                                <Text style={styles.colQty}>{item.quantity}</Text>
                                <Text style={styles.colPrice}>{formatPrice(item.price)}</Text>
                                <Text style={styles.colTotal}>{formatPrice(item.price * item.quantity)}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Totals */}
                <View style={styles.totals}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Sous-total / Subtotal</Text>
                        <Text>{formatPrice(subtotal)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Livraison / Shipping</Text>
                        <Text>{shipping === 0 ? 'Offerte' : formatPrice(shipping)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TVA (incluse) / VAT</Text>
                        <Text>{formatPrice(tax)}</Text>
                    </View>
                    <View style={styles.grandTotal}>
                        <Text style={styles.grandTotalText}>TOTAL</Text>
                        <Text style={styles.grandTotalText}>{formatPrice(total)}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Merci de votre confiance ! / Thank you for your business!</Text>
                    <Text style={{ marginTop: 5 }}>LeBazare - SIRET: XXXXXXXXXXXXXX - TVA: FRXXXXXXXXXXX</Text>
                </View>
            </Page>
        </Document>
    );
};
