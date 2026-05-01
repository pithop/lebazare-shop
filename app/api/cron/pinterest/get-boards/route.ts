import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

export async function GET(req: NextRequest) {
  try {
    let accessToken;
    try {
      accessToken = await getPinterestAccessToken();
    } catch (e: any) {
      console.error("Token refresh error:", e.message);
      return NextResponse.json({ error: 'Pinterest authentication error', details: e.message }, { status: 500 });
    }

    // Call the Pinterest v5 API to get boards
    const pinterestRes = await fetch('https://api.pinterest.com/v5/boards', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await pinterestRes.json();

    if (!pinterestRes.ok) {
      console.error('Pinterest API Error:', data);
      return NextResponse.json(
        { error: 'Failed to fetch boards from Pinterest', details: data },
        { status: pinterestRes.status }
      );
    }

    // Return the boards so you can find your board_id
    return NextResponse.json({
      success: true,
      message: 'Here are your Pinterest boards. Find the "id" of the board you want to use.',
      boards: data.items,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching Pinterest boards:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
