'use client'

import { createProduct } from '@/actions/products'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        try {
            await createProduct(formData)
            // Redirect is handled in server action, but if we want client-side handling:
            // router.push('/admin/products') 
            // However, createProduct calls redirect() which throws an error NEXT_REDIRECT
            // So we should let it bubble or handle it. 
            // Actually, calling server action from onSubmit doesn't automatically handle redirect if it throws.
            // But let's try just invoking it.
        } catch (error) {
            // Next.js redirects throw an error, so we need to ignore that one
            // or just let the form action handle it if we used action={createProduct}
            // But we had type issues.
            // A better way is to use useTransition or just accept the type error? No.
            // Let's just use the action prop but cast it or wrap it?
            // Or just ignore the lint if it works?
            // No, let's do it properly.
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Alternative: Use action prop but with a wrapper that returns void
    const handleAction = async (formData: FormData) => {
        await createProduct(formData)
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="text-slate-500 hover:text-slate-800">
                    ← Retour
                </Link>
                <h1 className="text-3xl font-serif text-slate-800">Nouveau Produit</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <form action={handleAction} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                            Titre
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
                                Prix (€)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                step="0.01"
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">
                                Stock
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                required
                                defaultValue={1}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-1">
                                Image
                            </label>
                            <div className="space-y-4">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                />
                                <p className="text-xs text-slate-500">
                                    Ou entrez une URL externe (optionnel si fichier sélectionné)
                                </p>
                                {/* We can keep the text input as a fallback or alternative, but need different name or logic. 
                  For simplicity, let's use the same name 'image' and handle it in the action (File vs String).
                  But HTML forms send file input even if empty. 
                  Let's just use file input for now as primary.
              */}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                        >
                            Créer le produit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
