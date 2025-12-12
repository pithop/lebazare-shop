import Link from 'next/link';

export const metadata = {
    title: 'Admin Dashboard - LeBazare',
};

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen bg-stone-50">
            <div className="flex">
                {/* Admin Sidebar */}
                <aside className="w-64 bg-deep-blue text-white min-h-screen p-6 hidden md:block">
                    <h2 className="text-2xl font-serif font-bold mb-8 text-sand">LeBazare Admin</h2>
                    <nav className="space-y-4">
                        <Link href="/admin-dashboard" className="block px-4 py-2 bg-white/10 rounded text-sand font-medium">
                            Vue d'ensemble
                        </Link>
                        <Link href="#" className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-white/5 rounded transition-colors">
                            Commandes
                        </Link>
                        <Link href="#" className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-white/5 rounded transition-colors">
                            Produits
                        </Link>
                        <Link href="#" className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-white/5 rounded transition-colors">
                            Clients
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-serif text-dark-text">Tableau de Bord</h1>
                        <button className="bg-terracotta text-white px-4 py-2 rounded hover:bg-accent-red transition-colors">
                            + Nouveau Produit
                        </button>
                    </header>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-100">
                            <h3 className="text-stone-500 text-sm font-medium uppercase mb-2">Ventes du jour</h3>
                            <p className="text-3xl font-serif text-dark-text">1,240.00 €</p>
                            <span className="text-green-500 text-sm font-medium">+12% vs hier</span>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-100">
                            <h3 className="text-stone-500 text-sm font-medium uppercase mb-2">Commandes en cours</h3>
                            <p className="text-3xl font-serif text-dark-text">8</p>
                            <span className="text-stone-400 text-sm">À traiter</span>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-100">
                            <h3 className="text-stone-500 text-sm font-medium uppercase mb-2">Visiteurs</h3>
                            <p className="text-3xl font-serif text-dark-text">342</p>
                            <span className="text-green-500 text-sm font-medium">+5% vs semaine dernière</span>
                        </div>
                    </div>

                    {/* Recent Orders Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-stone-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center">
                            <h3 className="font-serif text-lg text-dark-text">Commandes Récentes</h3>
                            <Link href="#" className="text-terracotta text-sm hover:underline">Voir tout</Link>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-stone-50">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-stone-600 text-sm">ID</th>
                                    <th className="px-6 py-3 font-medium text-stone-600 text-sm">Client</th>
                                    <th className="px-6 py-3 font-medium text-stone-600 text-sm">Date</th>
                                    <th className="px-6 py-3 font-medium text-stone-600 text-sm">Total</th>
                                    <th className="px-6 py-3 font-medium text-stone-600 text-sm">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                                        <td className="px-6 py-3 text-sm text-dark-text">#LB-102{i}</td>
                                        <td className="px-6 py-3 text-sm text-stone-600">Client {i}</td>
                                        <td className="px-6 py-3 text-sm text-stone-600">12 Dec 2024</td>
                                        <td className="px-6 py-3 text-sm text-dark-text">{(45 * i).toFixed(2)} €</td>
                                        <td className="px-6 py-3">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                En attente
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
