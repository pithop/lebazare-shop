import { createClient } from '@/lib/supabase-server';
import { Product } from './types';

// Helper to map Supabase product to Shopify-style Product interface
function mapSupabaseToProduct(sbProduct: any): Product {
  return {
    id: sbProduct.id,
    title: sbProduct.title,
    handle: sbProduct.slug,
    description: sbProduct.description || '',
    category: sbProduct.category,
    images: {
      edges: (sbProduct.images || []).map((url: string) => ({
        node: {
          url,
          altText: sbProduct.title,
        },
      })),
    },
    priceRange: {
      minVariantPrice: {
        amount: sbProduct.price.toString(),
        currencyCode: sbProduct.currency || 'EUR',
      },
    },
    variants: {
      edges: [
        {
          node: {
            id: sbProduct.id, // Use product ID as variant ID for simple products
            title: 'Default Title',
            priceV2: {
              amount: sbProduct.price.toString(),
              currencyCode: sbProduct.currency || 'EUR',
            },
            availableForSale: sbProduct.stock > 0,
          },
        },
      ],
    },
  };
}

export async function getAllProducts(limit: number = 20): Promise<Product[]> {
  const supabase = createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    return [];
  }

  return products.map(mapSupabaseToProduct);
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const supabase = createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', handle)
    .single();

  if (error || !product) {
    console.error('Error fetching product by handle:', error);
    return null;
  }

  return mapSupabaseToProduct(product);
}
