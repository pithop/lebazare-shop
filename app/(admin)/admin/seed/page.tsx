'use client'

import { seedProducts } from '@/actions/seed-products'
import { useState } from 'react'

export default function SeedPage() {
    const [status, setStatus] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const handleSeed = async () => {
        setLoading(true)
        setStatus('Importing...')
        try {
            const result = await seedProducts()
            setStatus(`Imported: ${result.count}, Errors: ${result.errors}`)
        } catch (error) {
            setStatus('Error: ' + error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Import Products from JSON</h1>
            <button
                onClick={handleSeed}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? 'Importing...' : 'Start Import'}
            </button>
            {status && <p className="mt-4 text-lg">{status}</p>}
        </div>
    )
}
