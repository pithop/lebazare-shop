import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        const { data: order, error } = await supabase
            .from('orders')
            .select('id, total, status, created_at')
            .eq('id', params.id)
            .single();

        if (error || !order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error: any) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
