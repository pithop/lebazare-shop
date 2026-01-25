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

  return (products || []).map(mapSupabaseToProduct);
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

  return (products || []).map(mapSupabaseToProduct);
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

  return (products || []).map(mapSupabaseToProduct);
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

  return (products || []).map(mapSupabaseToProduct);
}

/**
 * Get trending products sorted by best ratings and most reviews
 * Uses a "trending score" = average_rating * sqrt(review_count) to balance quality and quantity
 */
export async function getTrendingProducts(limit: number = 5): Promise<Product[]> {
  const supabase = createClient();

  // First, get all active products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, title, price, stock, category, images, slug, created_at, is_active, product_variants(id, name, price, stock, attributes)')
    .eq('is_active', true);

  if (productsError || !products) {
    console.error('Error fetching products for trending:', productsError);
    return [];
  }

  // Get review stats for all products
  const { data: reviewStats, error: reviewsError } = await supabase
    .from('reviews')
    .select('product_id, rating')
    .eq('status', 'published');

  if (reviewsError) {
    console.error('Error fetching review stats:', reviewsError);
    // Fall back to regular products if reviews fail
    return products.slice(0, limit).map(mapSupabaseToProduct);
  }

  // Calculate stats per product
  const productStats: Record<string, { avgRating: number; reviewCount: number; trendingScore: number }> = {};

  if (reviewStats && reviewStats.length > 0) {
    // Group reviews by product
    const reviewsByProduct: Record<string, number[]> = {};
    reviewStats.forEach((review: { product_id: string; rating: number }) => {
      if (!reviewsByProduct[review.product_id]) {
        reviewsByProduct[review.product_id] = [];
      }
      reviewsByProduct[review.product_id].push(review.rating);
    });

    // Calculate average and count for each product
    Object.entries(reviewsByProduct).forEach(([productId, ratings]) => {
      const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      const reviewCount = ratings.length;
      // Trending score: average rating * sqrt(review count)
      // This balances quality (rating) with popularity (count)
      const trendingScore = avgRating * Math.sqrt(reviewCount);
      productStats[productId] = { avgRating, reviewCount, trendingScore };
    });
  }

  // Sort products by trending score (highest first), then by created_at for products without reviews
  const sortedProducts = products
    .map(product => ({
      ...product,
      stats: productStats[product.id] || { avgRating: 0, reviewCount: 0, trendingScore: 0 }
    }))
    .sort((a, b) => {
      // Primary sort: trending score (descending)
      if (b.stats.trendingScore !== a.stats.trendingScore) {
        return b.stats.trendingScore - a.stats.trendingScore;
      }
      // Secondary sort: review count (descending)
      if (b.stats.reviewCount !== a.stats.reviewCount) {
        return b.stats.reviewCount - a.stats.reviewCount;
      }
      // Tertiary sort: created_at (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .slice(0, limit);

  return sortedProducts.map(mapSupabaseToProduct);
}

