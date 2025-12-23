interface DashboardStats {
    totalRevenue: number
    totalOrders: number
    chartData: { date: string; amount: number }[]
    topProducts: { title: string; count: number; image: string }[]
}

export default function DashboardCharts({ stats }: { stats: DashboardStats }) {
    if (!stats) return <div className="text-red-500">Données non disponibles</div>

    // Helper for Line Chart
    const maxAmount = Math.max(...stats.chartData.map((d: any) => d.amount), 100)
    const points = stats.chartData.map((d: any, i: number) => {
        const x = (i / (stats.chartData.length - 1 || 1)) * 100
        const y = 100 - (d.amount / maxAmount) * 100
        return `${x},${y}`
    }).join(' ')

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Chiffre d'affaires</h3>
                    <p className="text-3xl font-serif text-slate-900">{stats.totalRevenue.toFixed(2)} €</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Commandes</h3>
                    <p className="text-3xl font-serif text-slate-900">{stats.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Panier Moyen</h3>
                    <p className="text-3xl font-serif text-slate-900">
                        {(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0).toFixed(2)} €
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-medium text-slate-900 mb-6">Évolution du Chiffre d'affaires (30 jours)</h3>
                    <div className="h-64 w-full relative">
                        {stats.chartData.length > 0 ? (
                            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                                {/* Grid lines */}
                                <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="100" x2="100" y2="100" stroke="#f1f5f9" strokeWidth="1" />

                                {/* Area */}
                                <path
                                    d={`M0,100 ${points} L100,100 Z`}
                                    fill="rgba(79, 70, 229, 0.1)"
                                    stroke="none"
                                />
                                {/* Line */}
                                <polyline
                                    fill="none"
                                    stroke="#4f46e5"
                                    strokeWidth="2"
                                    points={points}
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                Pas assez de données
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-400">
                        <span>{stats.chartData[0]?.date}</span>
                        <span>{stats.chartData[stats.chartData.length - 1]?.date}</span>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-medium text-slate-900 mb-6">Top Produits</h3>
                    <div className="space-y-6">
                        {stats.topProducts.map((product: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-stone-50 rounded-lg overflow-hidden relative flex-shrink-0 border border-slate-100">
                                    {product.image && (
                                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{product.title}</p>
                                    <p className="text-xs text-slate-500">{product.count} ventes</p>
                                </div>
                                <div className="text-sm font-bold text-slate-900">#{idx + 1}</div>
                            </div>
                        ))}
                        {stats.topProducts.length === 0 && (
                            <p className="text-sm text-slate-400">Aucune vente pour le moment</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
