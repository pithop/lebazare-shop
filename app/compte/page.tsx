import Link from 'next/link';

export const metadata = {
    title: 'Mon Compte - LeBazare',
};

export default function AccountPage() {
    // Mock data
    const orders = [
        { id: '#LB-1023', date: '12 Dec 2024', status: 'En cours', total: '145.00 €' },
        { id: '#LB-1001', date: '01 Nov 2024', status: 'Livré', total: '89.50 €' },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-serif text-terracotta mb-8">Mon Compte</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar / Profile Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center text-2xl text-stone-500">
                            JD
                        </div>
                        <div>
                            <h2 className="font-serif text-xl">John Doe</h2>
                            <p className="text-sm text-stone-500">john.doe@example.com</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <Link href="/compte" className="block px-4 py-2 bg-beige text-terracotta rounded font-medium">
                            Mes Commandes
                        </Link>
                        <Link href="/compte/profil" className="block px-4 py-2 text-stone-600 hover:bg-stone-50 rounded transition-colors">
                            Mes Informations
                        </Link>
                        <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded transition-colors">
                            Déconnexion
                        </button>
                    </nav>
                </div>

                {/* Main Content - Orders */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-serif text-dark-text mb-4">Mes Dernières Commandes</h2>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-stone-50 border-b border-stone-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-stone-600">Commande</th>
                                    <th className="px-6 py-4 font-medium text-stone-600">Date</th>
                                    <th className="px-6 py-4 font-medium text-stone-600">Statut</th>
                                    <th className="px-6 py-4 font-medium text-stone-600">Total</th>
                                    <th className="px-6 py-4 font-medium text-stone-600">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-dark-text">{order.id}</td>
                                        <td className="px-6 py-4 text-stone-600">{order.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Livré' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-dark-text">{order.total}</td>
                                        <td className="px-6 py-4">
                                            <button className="text-terracotta hover:underline text-sm">Voir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
