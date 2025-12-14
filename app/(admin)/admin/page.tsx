import { createClient } from '@/lib/supabase-server';

export default async function AdminDashboard() {
    const supabase = createClient();

    // Fetch stats
    const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });

    return (
        <div className="p-8">
            <h1 className="text-3xl font-serif text-slate-800 mb-8">Tableau de Bord</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium uppercase mb-2">Produits</h3>
                    <p className="text-3xl font-serif text-slate-800">{productsCount || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium uppercase mb-2">Commandes</h3>
                    <p className="text-3xl font-serif text-slate-800">{ordersCount || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium uppercase mb-2">Revenu (Total)</h3>
                    <p className="text-3xl font-serif text-slate-800">0.00 €</p>
                </div>
            </div>
        </div>
    );
}
