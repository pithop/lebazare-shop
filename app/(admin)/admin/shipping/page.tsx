import { createAdminClient } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ShippingProfilesManager from '@/components/admin/ShippingProfilesManager';
import CustomZonesManager from '@/components/admin/CustomZonesManager';

export default async function ShippingAdminPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    const adminClient = createAdminClient();
    
    // Fetch profiles
    const { data: profiles } = await adminClient
        .from('shipping_profiles')
        .select(`
            *,
            shipping_profile_destinations (*)
        `)
        .order('created_at', { ascending: false });

    // Fetch custom zones
    const { data: customZones } = await adminClient
        .from('custom_shipping_zones')
        .select('*')
        .order('name', { ascending: true });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-slate-900">Profils de Livraison</h1>
                <p className="text-slate-500 mt-1">Configurez des frais de livraison sur-mesure par zone géographique, façon Etsy.</p>
            </div>

            <CustomZonesManager initialZones={customZones || []} />

            <ShippingProfilesManager initialProfiles={profiles || []} customZones={customZones || []} />
        </div>
    );
}
