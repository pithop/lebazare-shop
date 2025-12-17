'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success('Connexion réussie');
                router.push('/compte');
                router.refresh();
            }
        } catch (error) {
            toast.error('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-stone-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl text-slate-900 mb-2">Connexion</h1>
                    <p className="text-slate-500">Accédez à votre espace client</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-colors"
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-terracotta text-white py-3 rounded-lg font-medium hover:bg-terracotta/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Pas encore de compte ?{' '}
                    <Link href="/signup" className="text-terracotta hover:underline font-medium">
                        Créer un compte
                    </Link>
                </div>
            </div>
        </div>
    );
}
