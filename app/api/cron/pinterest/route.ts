import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase admin client (requires service role key to bypass RLS if needed, or anon key if policies allow)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function getPinterestAccessToken() {
    const appId = process.env.PINTEREST_APP_ID;
    const appSecret = process.env.PINTEREST_APP_SECRET;
    const refreshToken = process.env.PINTEREST_REFRESH_TOKEN;

    if (!appId || !appSecret || !refreshToken) {
        throw new Error("Missing Pinterest OAuth credentials (APP_ID, APP_SECRET, or REFRESH_TOKEN) in environment variables.");
    }

    const authHeader = Buffer.from(`${appId}:${appSecret}`).toString('base64');

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
    });

    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(`Failed to refresh Pinterest token: ${JSON.stringify(data)}`);
    }

    return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authorization Header (Cron Secret)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error('CRON_SECRET is not defined in environment variables.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch one unpublished product
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, title, description, slug, images, category')
      .eq('is_active', true)
      .eq('pinterest_published', false)
      .order('created_at', { ascending: true }) // Publish oldest first
      .limit(1);

    if (fetchError) {
      console.error('Error fetching product from Supabase:', fetchError);
      return NextResponse.json({ error: 'Database fetch error' }, { status: 500 });
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ message: 'No unpublished products found. Nothing to do.' }, { status: 200 });
    }

    const product = products[0];

    // Ensure we have an image
    if (!product.images || product.images.length === 0) {
      console.error(`Product ${product.id} has no images. Marking as published to skip.`);
      await supabase.from('products').update({ pinterest_published: true }).eq('id', product.id);
      return NextResponse.json({ message: 'Skipped product with no image' }, { status: 200 });
    }

    const imageUrl = product.images[0];
    const productUrl = `https://www.lebazare.fr/produits/${product.slug}`;
    const boardId = process.env.PINTEREST_BOARD_ID;
    
    if (!boardId) {
      console.error('Pinterest Board ID is missing.');
      return NextResponse.json({ error: 'Pinterest configuration error' }, { status: 500 });
    }

    let accessToken;
    try {
      accessToken = await getPinterestAccessToken();
    } catch (e: any) {
      console.error("Token refresh error:", e.message);
      return NextResponse.json({ error: 'Pinterest authentication error', details: e.message }, { status: 500 });
    }

    // Prepare Pinterest API Payload
    const cleanDescription = (product.description || '').substring(0, 450); // Pinterest max is 500, leave room for tags
    const tags = product.category ? `#${product.category.replace(/[^a-zA-Z0-9]/g, '')} #ArtisanatMarocain #DecoBoheme` : '#ArtisanatMarocain #DecoBoheme #LeBazare';
    
    const pinPayload = {
      board_id: boardId,
      title: product.title.substring(0, 100), // Max 100 chars
      description: `${cleanDescription}\n\n${tags}`,
      link: productUrl,
      media_source: {
        source_type: "image_url",
        url: imageUrl
      }
    };

    // 3. Send to Pinterest API v5
    const pinterestRes = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(pinPayload)
    });

    const pinterestData = await pinterestRes.json();

    if (!pinterestRes.ok) {
      console.error('Pinterest API Error:', pinterestData);
      return NextResponse.json({ 
        error: 'Failed to create Pin', 
        details: pinterestData 
      }, { status: pinterestRes.status });
    }

    // 4. Mark as published in Supabase
    const { error: updateError } = await supabase
      .from('products')
      .update({ pinterest_published: true })
      .eq('id', product.id);

    if (updateError) {
      console.error('Failed to update product status in Supabase:', updateError);
      // We still return 200 because the pin was created, but log the error
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully pinned product: ${product.title}`,
      pin_id: pinterestData.id
    }, { status: 200 });

  } catch (error: any) {
    console.error('Unexpected error in Pinterest Cron:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
