import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: product } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('id', params.id)
        .single();

    if (!product) {
        notFound();
    }

    return <EditProductForm product={product} />;
}
