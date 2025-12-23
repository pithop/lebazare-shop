import DashboardCharts from '@/components/admin/DashboardCharts';
import { createClient } from '@/lib/supabase-server';

export default async function AdminDashboard() {
    const supabase = createClient();

    // Fetch basic stats
    const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

    // Calculate total revenue (approximate)
    const { data: orders } = await supabase.from('orders').select('total').eq('status', 'paid');
    const totalRevenue = orders?.reduce((acc, order) => acc + order.total, 0) || 0;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-serif text-slate-800 mb-8">Tableau de Bord</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Chiffre d'affaires</h3>
                    <p className="text-3xl font-bold text-slate-900">{totalRevenue.toFixed(2)} €</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Commandes</h3>
                    <p className="text-3xl font-bold text-slate-900">{orderCount || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Produits</h3>
                    <p className="text-3xl font-bold text-slate-900">{productCount || 0}</p>
                </div>
            </div>

            <DashboardCharts />
        </div>
    );
}
