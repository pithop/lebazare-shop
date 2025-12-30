import { createClient } from '@/lib/supabase-server';
import { Product } from './types';

// Helper to map Supabase product to Shopify-style Product interface
function mapSupabaseToProduct(sbProduct: any): Product {
  const variants = sbProduct.product_variants && sbProduct.product_variants.length > 0
    ? sbProduct.product_variants.map((v: any) => ({
      node: {
        id: v.id,
        title: v.name,
        priceV2: {
          amount: (v.price || sbProduct.price).toString(),
          currencyCode: sbProduct.currency || 'EUR',
        },
        availableForSale: v.stock > 0,
        attributes: v.attributes // Custom field, not in standard Shopify type but useful
      }
    }))
    : [
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
    ]

  return {
    id: sbProduct.id,
    title: sbProduct.title,
    handle: sbProduct.slug,
    description: sbProduct.description || '',
    category: sbProduct.category,
    video_url: sbProduct.video_url,
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
      edges: variants,
    },
  };
}

export async function getAllProducts(limit: number = 20): Promise<Product[]> {
  const supabase = createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, price, stock, category, images, slug, created_at, is_active, product_variants(id, name, price, stock, attributes)')
    .eq('is_active', true)
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    return [];
  }

  return products.map(mapSupabaseToProduct);
}

export async function getStaticProducts(limit: number = 20): Promise<Product[]> {
  const supabase = createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, price, stock, category, images, slug, created_at, is_active, product_variants(id, name, price, stock, attributes)')
    .eq('is_active', true)
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching static products:', error);
    return [];
  }

  return products.map(mapSupabaseToProduct);
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const supabase = createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('slug', handle)
    .eq('slug', handle)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product by handle:', error);
    return null;
  }

  if (!product) {
    return null;
  }

  return mapSupabaseToProduct(product);
}

export async function getRelatedProducts(currentProductId: string, category?: string, limit: number = 4): Promise<Product[]> {
  const supabase = createClient();

  let query = supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('is_active', true)
    .neq('id', currentProductId)
    .limit(limit);

  if (category) {
    query = query.eq('category', category);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }

  // If not enough products in category, fetch random ones to fill the gap
  if (!products || products.length < limit) {
    const { data: randomProducts } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('is_active', true)
      .neq('id', currentProductId)
      .limit(limit);

    if (randomProducts) {
      // Combine and deduplicate
      const combined = [...(products || []), ...randomProducts];
      const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, limit);
      return unique.map(mapSupabaseToProduct);
    }
  }

  return products.map(mapSupabaseToProduct);
}

export interface ProductFilterParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}

export async function getFilteredProducts(params: ProductFilterParams): Promise<Product[]> {
  const supabase = createClient();
  const { query, category, minPrice, maxPrice, limit = 20 } = params;

  let dbQuery = supabase
    .from('products')
    .select('id, title, price, stock, category, images, slug, created_at, is_active, product_variants(id, name, price, stock, attributes)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`);
  }

  if (category && category !== 'all') {
    dbQuery = dbQuery.eq('category', category);
  }

  // Note: Price filtering on the 'products' table assumes the base price is relevant.
  // For complex variant pricing, this might need adjustment, but for performance it's a good first step.
  if (minPrice !== undefined) {
    dbQuery = dbQuery.gte('price', minPrice);
  }

  if (maxPrice !== undefined) {
    dbQuery = dbQuery.lte('price', maxPrice);
  }

  const { data: products, error } = await dbQuery;

  if (error) {
    console.error('Error fetching filtered products:', error);
    return [];
  }

  return products.map(mapSupabaseToProduct);
}
