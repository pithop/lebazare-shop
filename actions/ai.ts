'use server'

import { headers } from 'next/headers'

export async function chatWithAI(messages: any[], context: string) {
    const apiKey = process.env.OPENROUTER_API_KEY
    const headersList = headers()
    const origin = headersList.get('origin') || headersList.get('host')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (origin ? `https://${origin}` : 'https://www.lebazare.fr')

    if (!apiKey) {
        return { error: 'Clé API OpenRouter manquante. Veuillez configurer OPENROUTER_API_KEY.' }
    }

    const systemPrompt = `Tu es l'assistant IA intelligent de l'administration e-commerce "LeBazare".
Ton rôle est d'aider l'administrateur à gérer sa boutique, analyser les ventes, et rédiger des descriptions de produits.
Tu as accès au contexte suivant sur la page actuelle :
${context}

Réponds de manière professionnelle, concise et utile. Si tu dois générer du contenu (comme une description), fais-le de manière créative et optimisée pour le SEO.
Utilise le format Markdown pour tes réponses.`

    try {
        // Some models (like Gemma 3) don't support the 'system' role.
        // We inject the system prompt into the conversation history.
        let combinedMessages = [...messages];

        if (combinedMessages.length > 0) {
            if (combinedMessages[0].role === 'user') {
                // If first message is user, prepend system prompt to it
                combinedMessages[0] = {
                    ...combinedMessages[0],
                    content: `${systemPrompt}\n\n---\n\n${combinedMessages[0].content}`
                };
            } else {
                // If first message is assistant (or other), insert a user message with system prompt before it
                combinedMessages = [
                    { role: 'user', content: systemPrompt },
                    ...combinedMessages
                ];
            }
        } else {
            // Fallback if no messages provided
            combinedMessages.push({ role: 'user', content: systemPrompt });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": siteUrl,
                "X-Title": "LeBazare Admin",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemma-3-12b-it:free",
                "messages": combinedMessages
            })
        });

        if (!response.ok) {
            const errorText = await response.text()
            console.error('OpenRouter API Error:', errorText)
            return { error: `Erreur API: ${response.statusText} - ${errorText}` }
        }

        const data = await response.json()
        return { message: data.choices[0].message }
    } catch (error) {
        console.error('AI Chat Error:', error)
        return { error: 'Une erreur est survenue lors de la communication avec l\'IA.' }
    }
}
