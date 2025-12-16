import DashboardCharts from '@/components/admin/DashboardCharts';

export default function AdminDashboard() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-serif text-slate-800 mb-8">Tableau de Bord</h1>
            <DashboardCharts />
        </div>
    );
}
