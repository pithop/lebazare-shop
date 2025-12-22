'use client'

import { useState, useEffect, useRef } from 'react'

interface AddressAutocompleteProps {
    onSelect: (address: {
        street: string
        city: string
        postalCode: string
        country: string
    }) => void
    onChange?: (value: string) => void
    defaultValue?: string
}

export default function AddressAutocomplete({ onSelect, onChange, defaultValue = '' }: AddressAutocompleteProps) {
    const [query, setQuery] = useState(defaultValue)
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = async (value: string) => {
        setQuery(value)
        if (onChange) onChange(value)

        if (value.length > 2) {
            try {
                const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}&limit=5`)
                const data = await response.json()
                setSuggestions(data.features || [])
                setIsOpen(true)
            } catch (error) {
                console.error('Error fetching addresses:', error)
            }
        } else {
            setSuggestions([])
            setIsOpen(false)
        }
    }

    const handleSelect = (feature: any) => {
        const { properties } = feature
        const address = {
            street: properties.name,
            city: properties.city,
            postalCode: properties.postcode,
            country: 'FR' // API is France only
        }
        setQuery(properties.label)
        setSuggestions([])
        setIsOpen(false)
        onSelect(address)
    }

    return (
        <div ref={wrapperRef} className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
            <input
                type="text"
                name="address"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                placeholder="Commencez à taper votre adresse..."
                autoComplete="off"
                required
            />
            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((feature: any) => (
                        <li
                            key={feature.properties.id}
                            onClick={() => handleSelect(feature)}
                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                        >
                            {feature.properties.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
