import '../globals.css';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, RefreshCw, LogOut, Settings } from 'lucide-react';
import AIAssistant from '@/components/admin/AIAssistant';

export const metadata = {
    title: 'Admin - LeBazare',
    description: 'Administration LeBazare',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body className="bg-stone-50 min-h-screen flex font-sans text-slate-900">
                {/* Sidebar */}
                <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
                    <div className="p-6 border-b border-slate-100">
                        <h1 className="text-2xl font-serif font-bold text-slate-900">LeBazare</h1>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-medium">Administration</p>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1">
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group"
                        >
                            <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                            <span className="font-medium">Tableau de Bord</span>
                        </Link>
                        <Link
                            href="/admin/products"
                            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group"
                        >
                            <Package className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                            <span className="font-medium">Produits</span>
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group"
                        >
                            <ShoppingBag className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                            <span className="font-medium">Commandes</span>
                        </Link>
                        <Link
                            href="/admin/etsy-sync"
                            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group"
                        >
                            <RefreshCw className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                            <span className="font-medium">Sync Etsy</span>
                        </Link>
                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group"
                        >
                            <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                            <span className="font-medium">Paramètres</span>
                        </Link>
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold shadow-md">
                                A
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">Administrateur</p>
                                <p className="text-xs text-slate-500 truncate">admin@lebazare.com</p>
                            </div>
                            <Settings className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto relative">
                    {children}
                    <AIAssistant context="Vous êtes sur le panneau d'administration." />
                </main>
            </body>
        </html>
    );
}
