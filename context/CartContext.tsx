'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface CartItem {
    id: string
    productId: string // Added to link to parent product
    title: string
    price: number
    image: string
    quantity: number
    maxStock: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
    isCartOpen: boolean
    setIsCartOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from local storage
    useEffect(() => {
        const savedCart = localStorage.getItem('lebazare_cart')
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error('Failed to parse cart', e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('lebazare_cart', JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addItem = useCallback((newItem: CartItem) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === newItem.id)
            if (existingItem) {
                return currentItems.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.maxStock) }
                        : item
                )
            }
            return [...currentItems, newItem]
        })
        setIsCartOpen(true)
    }, [])

    const removeItem = useCallback((id: string) => {
        setItems(currentItems => currentItems.filter(item => item.id !== id))
    }, [])

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(id)
            return
        }
        setItems(currentItems =>
            currentItems.map(item =>
                item.id === id ? { ...item, quantity: Math.min(quantity, item.maxStock) } : item
            )
        )
    }, [removeItem])

    const clearCart = useCallback(() => {
        setItems([])
    }, [])

    const cartCount = items.reduce((total, item) => total + item.quantity, 0)
    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)

    const value = React.useMemo(() => ({
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen
    }), [items, addItem, removeItem, updateQuantity, clearCart, cartCount, cartTotal, isCartOpen])

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
