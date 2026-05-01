'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function saveShippingProfile(profileId: string | null, name: string, destinations: any[], productIds?: string[]) {
    try {
        let currentProfileId = profileId;

        // 1. Create or Update Profile
        if (currentProfileId) {
            const { error } = await supabase
                .from('shipping_profiles')
                .update({ name })
                .eq('id', currentProfileId);
            if (error) throw error;
        } else {
            const { data, error } = await supabase
                .from('shipping_profiles')
                .insert({ name })
                .select()
                .single();
            if (error) throw error;
            currentProfileId = data.id;
        }

        // 2. Delete existing destinations to recreate them
        await supabase
            .from('shipping_profile_destinations')
            .delete()
            .eq('profile_id', currentProfileId);

        // 3. Insert new destinations
        if (destinations.length > 0) {
            const formattedDestinations = destinations.map(d => ({
                profile_id: currentProfileId,
                zone: d.zone,
                base_price_cents: Math.round(d.base_price * 100), // Convert to cents
                additional_price_cents: Math.round(d.additional_price * 100)
            }));

            const { error } = await supabase
                .from('shipping_profile_destinations')
                .insert(formattedDestinations);
            
            if (error) throw error;
        }

        // 4. Update Product Associations
        if (productIds !== undefined && currentProfileId) {
            // First, remove association from products that were linked to this profile but are no longer in the list
            if (productIds.length > 0) {
                await supabase
                    .from('products')
                    .update({ shipping_profile_id: null })
                    .eq('shipping_profile_id', currentProfileId)
                    .not('id', 'in', `(${productIds.join(',')})`);
                
                // Then, associate the selected products
                await supabase
                    .from('products')
                    .update({ shipping_profile_id: currentProfileId })
                    .in('id', productIds);
            } else {
                // If empty array, remove all associations for this profile
                await supabase
                    .from('products')
                    .update({ shipping_profile_id: null })
                    .eq('shipping_profile_id', currentProfileId);
            }
        }

        revalidatePath('/admin/shipping');
        revalidatePath('/admin/products');
        revalidatePath('/admin/products/new');
        // Will also need to revalidate product edit pages
        
        return { success: true };
    } catch (error: any) {
        console.error("Failed to save profile", error);
        return { success: false, error: error.message };
    }
}

export async function deleteShippingProfile(profileId: string) {
    try {
        const { error } = await supabase
            .from('shipping_profiles')
            .delete()
            .eq('id', profileId);
            
        if (error) throw error;

        revalidatePath('/admin/shipping');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getShippingProfiles() {
    try {
        const { data, error } = await supabase
            .from('shipping_profiles')
            .select('id, name')
            .order('name');
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Failed to fetch shipping profiles', error);
        return [];
    }
}

export async function searchProductsForShipping(query: string) {
    if (!query || query.trim() === '') return [];
    
    try {
        const { data, error } = await supabase
            .from('products')
            .select('id, title, images, shipping_profile_id, price')
            .ilike('title', `%${query}%`)
            .limit(10);
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Failed to search products', error);
        return [];
    }
}

export async function getProductsForProfile(profileId: string) {
    if (!profileId) return [];
    
    try {
        const { data, error } = await supabase
            .from('products')
            .select('id, title, images, shipping_profile_id, price')
            .eq('shipping_profile_id', profileId);
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Failed to fetch products for profile', error);
        return [];
    }
}

// --- Custom Zones Actions ---

export async function getCustomZones() {
    try {
        const { data, error } = await supabase
            .from('custom_shipping_zones')
            .select('*')
            .order('name');
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Failed to fetch custom zones', error);
        return [];
    }
}

export async function saveCustomZone(id: string | null, name: string, countries: string[]) {
    try {
        if (id) {
            const { error } = await supabase
                .from('custom_shipping_zones')
                .update({ name, countries })
                .eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('custom_shipping_zones')
                .insert({ name, countries });
            if (error) throw error;
        }
        revalidatePath('/admin/shipping');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteCustomZone(id: string) {
    try {
        const { error } = await supabase
            .from('custom_shipping_zones')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        revalidatePath('/admin/shipping');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
