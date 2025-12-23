import DashboardCharts from '@/components/admin/DashboardCharts';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { getDashboardStats } from '@/actions/analytics';

export default async function AdminDashboard() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    // Fetch stats using the server action (which now uses adminClient)
    const stats = await getDashboardStats();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-serif text-slate-800 mb-8">Tableau de Bord</h1>

            {stats ? (
                <DashboardCharts stats={stats} />
            ) : (
                <div className="text-red-500">Erreur lors du chargement des statistiques.</div>
            )}
        </div>
    );
}
