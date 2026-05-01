import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'PINTEREST_ACCESS_TOKEN is missing from environment variables' },
        { status: 400 }
      );
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
