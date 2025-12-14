'use client'

import { deleteProduct } from '@/actions/products'
import { useState } from 'react'

export default function DeleteProductButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

        setIsDeleting(true)
        try {
            await deleteProduct(id)
        } catch (error) {
            console.error('Failed to delete:', error)
            alert('Erreur lors de la suppression')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <form onSubmit={handleDelete}>
            <button
                type="submit"
                disabled={isDeleting}
                className="text-red-400 hover:text-red-600 disabled:opacity-50"
            >
                {isDeleting ? '...' : 'Supprimer'}
            </button>
        </form>
    )
}
