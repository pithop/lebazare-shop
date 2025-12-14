'use client';

import { useState } from 'react';
import { syncEtsyProducts } from '@/actions/sync-etsy';

export default function EtsySyncPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleSync = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await syncEtsyProducts();
            setResult(res);
        } catch (error) {
            setResult({ success: false, message: 'An unexpected error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-serif text-slate-800 mb-8">Synchronisation Etsy</h1>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 max-w-2xl">
                <p className="text-slate-600 mb-6">
                    Cliquez sur le bouton ci-dessous pour récupérer les produits actifs de votre boutique Etsy et les mettre à jour dans la base de données.
                    Cette action peut prendre quelques secondes.
                </p>

                <button
                    onClick={handleSync}
                    disabled={loading}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Synchronisation en cours...
                        </>
                    ) : (
                        'Lancer la Synchronisation'
                    )}
                </button>

                {result && (
                    <div className={`mt-6 p-4 rounded-lg ${result.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        <p className="font-medium">{result.success ? 'Succès' : 'Erreur'}</p>
                        <p>{result.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
