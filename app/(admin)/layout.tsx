import '../globals.css';
import Link from 'next/link';

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
            <body className="bg-stone-50 min-h-screen flex">
                {/* Sidebar */}
                <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
                    <div className="p-6">
                        <h1 className="text-2xl font-serif font-bold text-sand">LeBazare</h1>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Admin</p>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        <Link
                            href="/admin"
                            className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/products"
                            className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                        >
                            Produits
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                        >
                            Commandes
                        </Link>
                        <Link
                            href="/admin/etsy-sync"
                            className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                        >
                            Sync Etsy
                        </Link>
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-sand/20 flex items-center justify-center text-sand font-bold">
                                A
                            </div>
                            <div className="text-sm">
                                <p className="font-medium">Admin</p>
                                <p className="text-xs text-slate-500">admin@lebazare.com</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </body>
        </html>
    );
}
