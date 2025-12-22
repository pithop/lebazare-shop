export interface Product {
  id: string;
  title: string;
  seo_title?: string;
  title_en?: string;
  description_en?: string;
  handle: string;
  description: string;
  category?: string;
  video_url?: string | null;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        priceV2: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
  // Logistics Fields
  origin_country?: string; // 'MA' | 'FR'
  hs_code?: string;
  material_type?: string;
  is_stackable?: boolean;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  weight_grams?: number;
  handling_tier?: 'standard' | 'fragile' | 'oversize';
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          product: Product; // Use the full Product type
          priceV2: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
  };
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  customer_details: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  // Logistics Fields
  shipping_total_cents?: number;
  tax_total_cents?: number;
  incoterm?: 'DAP' | 'DDP';
  shipments?: Shipment[];
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  country_code: string;
  address: any;
  is_active: boolean;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
}

export interface ShippingRate {
  id: string;
  zone_id: string;
  origin_warehouse_code: string;
  carrier_name: string;
  min_weight_grams: number;
  max_weight_grams: number | null;
  price_cents: number;
  currency: string;
  volumetric_factor: number;
  handling_fee_cents: number;
  estimated_days_min: number | null;
  estimated_days_max: number | null;
}

export interface Shipment {
  id: string;
  order_id: string;
  origin_warehouse_code: string;
  carrier: string;
  tracking_number: string | null;
  tracking_url: string | null;
  status: string;
  items: any[];
  weight_billed_grams: number | null;
  created_at: string;
}
