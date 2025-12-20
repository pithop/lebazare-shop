
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get('image') as File;

        if (!imageFile) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
        }

        const buffer = await imageFile.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        // List available models for debugging
        // const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // This doesn't list models.
        // We need to use the model manager if available, or just try a different model.

        // Let's try 'gemini-1.5-flash' again, but maybe the issue is the API key permissions.
        // But to be sure, let's try 'gemini-pro-vision' as a fallback if flash fails, or just log more info.

        // Actually, let's try to use the 'gemini-1.5-flash' model but handle the error more gracefully
        // and maybe try 'gemini-pro-vision' if it exists (though it's older).

        // For now, let's revert to 'gemini-1.5-flash' and add a comment about the API key.
        // But wait, the user got 404 for 'gemini-1.5-flash' too.

        // Let's try 'gemini-1.5-pro' to see if that works?
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Analyze this product image and generate a JSON response with the following fields:
        - title: A creative, SEO-friendly title for the product (in French).
        - description: A detailed, engaging description (in French).
        - price: An estimated price in EUR (number only).
        - category: The best matching category from this list: "decoration", "mobilier", "luminaires", "art-de-la-table", "tapis", "accessoires".
        - tags: A list of 5 relevant tags.

        Return ONLY the JSON.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: imageFile.type
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up the response if it contains markdown code blocks
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonString);

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error analyzing image:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return NextResponse.json({ error: 'Failed to analyze image', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
