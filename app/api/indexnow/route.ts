import { NextResponse } from 'next/server';

/**
 * Route API pour soumettre des URLs à IndexNow.
 * À appeler via un Webhook Supabase lors de l'ajout d'un produit
 * ou via une tâche CRON après la génération de pages.
 */
export async function POST(req: Request) {
    try {
        const { urls } = await req.json(); // Tableau d'URLs à indexer

        const API_KEY = process.env.INDEXNOW_KEY; // Clé générée (ex: UUID)
        const HOST = 'www.lebazre.fr';

        if (!API_KEY) {
            return NextResponse.json({ success: false, error: 'INDEXNOW_KEY not configured' }, { status: 500 });
        }

        // Le fichier clé doit être accessible à la racine (public/key.txt)
        const KEY_LOCATION = `https://${HOST}/${API_KEY}.txt`;

        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                host: HOST,
                key: API_KEY,
                keyLocation: KEY_LOCATION,
                urlList: urls,
            }),
        });

        if (response.ok) {
            return NextResponse.json({ success: true, message: 'URLs soumises à IndexNow' });
        } else {
            const errorText = await response.text();
            return NextResponse.json({ success: false, status: response.status, error: errorText }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
