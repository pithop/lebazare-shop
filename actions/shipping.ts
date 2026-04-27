'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function saveShippingProfile(profileId: string | null, name: string, destinations: any[]) {
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

        revalidatePath('/admin/shipping');
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
