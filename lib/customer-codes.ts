'use server';

import { createClient } from '@supabase/supabase-js';

// Characters that are easy to read and won't be confused (no 0/O, 1/I/L)
const SAFE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/**
 * Generate a random customer code like "LBZ-A7K2"
 */
function generateCode(): string {
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += SAFE_CHARS.charAt(Math.floor(Math.random() * SAFE_CHARS.length));
    }
    return `LBZ-${code}`;
}

/**
 * Get existing customer code for an email, or create a new one
 * Returns the customer code (new or existing)
 */
export async function getOrCreateCustomerCode(email: string): Promise<string> {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('SUPABASE_SERVICE_ROLE_KEY is missing');
        throw new Error('Configuration error');
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const normalizedEmail = email.toLowerCase().trim();

    // Check if this email already has a code (from previous orders)
    const { data: existingOrder, error: searchError } = await supabase
        .from('orders')
        .select('customer_code')
        .ilike('customer_details->>email', normalizedEmail)
        .not('customer_code', 'is', null)
        .limit(1)
        .maybeSingle();

    if (searchError) {
        console.error('Error searching for existing customer code:', searchError);
    }

    if (existingOrder?.customer_code) {
        return existingOrder.customer_code;
    }

    // Generate a new unique code
    let newCode = generateCode();
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure uniqueness
    while (attempts < maxAttempts) {
        const { data: codeExists } = await supabase
            .from('orders')
            .select('id')
            .eq('customer_code', newCode)
            .limit(1)
            .maybeSingle();

        if (!codeExists) {
            break; // Code is unique
        }

        newCode = generateCode();
        attempts++;
    }

    return newCode;
}

/**
 * Get all orders for a customer code
 */
export async function getOrdersByCode(code: string): Promise<{
    success: boolean;
    orders?: any[];
    error?: string;
}> {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return { success: false, error: 'Configuration error' };
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const normalizedCode = code.toUpperCase().trim();

    // Validate code format
    if (!/^LBZ-[A-Z0-9]{4}$/.test(normalizedCode)) {
        return { success: false, error: 'Format de code invalide' };
    }

    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            id,
            created_at,
            status,
            total,
            shipping_total_cents,
            customer_details,
            order_items (
                id,
                quantity,
                price,
                product:products (
                    id,
                    title,
                    slug,
                    images
                )
            )
        `)
        .eq('customer_code', normalizedCode)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders by code:', error);
        return { success: false, error: 'Erreur lors de la récupération des commandes' };
    }

    if (!orders || orders.length === 0) {
        return { success: false, error: 'Aucune commande trouvée pour ce code' };
    }

    return { success: true, orders };
}

