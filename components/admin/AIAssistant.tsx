'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Sparkles, Loader2, Minimize2, Maximize2 } from 'lucide-react'
import { chatWithAI } from '@/actions/ai'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function AIAssistant({ context = '' }: { context?: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Bonjour ! Je suis votre assistant LeBazare. Comment puis-je vous aider aujourd\'hui ?' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = { role: 'user' as const, content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        // Prepare context-aware prompt
        const response = await chatWithAI([...messages, userMessage], context)

        if (response.error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${response.error}` }])
        } else if (response.message) {
            setMessages(prev => [...prev, { role: 'assistant', content: response.message.content }])
        }

        setIsLoading(false)
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-slate-900 text-white p-4 rounded-full shadow-lg hover:bg-slate-800 transition-all hover:scale-110 z-50 group"
            >
                <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
            </button>
        )
    }

    return (
        <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col transition-all duration-300 ${isExpanded ? 'w-[600px] h-[80vh]' : 'w-[350px] h-[500px]'}`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 rounded-t-2xl text-white">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sand" />
                    <h3 className="font-medium">Assistant LeBazare</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:bg-slate-700 rounded transition-colors">
                        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-700 rounded transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                ? 'bg-slate-900 text-white rounded-tr-none'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                            }`}>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                {msg.content.split('\n').map((line, i) => (
                                    <p key={i} className="mb-1 last:mb-0">{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                            <span className="text-xs text-slate-400">Réflexion en cours...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-white rounded-b-2xl">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Posez une question..."
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    )
}
