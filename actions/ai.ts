'use server'

export async function chatWithAI(messages: any[], context: string) {
    const apiKey = process.env.OPENROUTER_API_KEY
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

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
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    ...messages
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text()
            console.error('OpenRouter API Error:', errorText)
            return { error: `Erreur API: ${response.statusText}` }
        }

        const data = await response.json()
        return { message: data.choices[0].message }
    } catch (error) {
        console.error('AI Chat Error:', error)
        return { error: 'Une erreur est survenue lors de la communication avec l\'IA.' }
    }
}
