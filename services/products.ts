import qs from 'qs';

const BASE_URL = 'https://pawlus.twinepos.dev/api/online/v1';

export interface ProductMedia {
  uuid: string;
  name: string;
  file_name: string;
  url: string;
  order: number;
  type: string;
  extension: string;
  size: number;
  mime_type: string;
  conversions?: Record<string, string>;
  square_image?: {
    src_set: string;
    src: string;
    width: number;
    height: number;
  };
}

export interface ProductVariantTypeOption {
  id: number;
  value: string;
  variant_type: {
    id: number;
    name: string;
  };
}

export interface ProductVariant {
  id: number;
  name: string;
  type: string;
  pricing_type: string;
  pricing_unit: { id: number; name: string };
  price: { currency: string; amount: number; formatted: string; scale: number };
  vat_rate: { id: number; name: string; code: string; value: number };
  variant_type_options: ProductVariantTypeOption[];
  media: ProductMedia[];
  inventory_items: {
    id: string;
    location: { id: string; name: string };
    available_quantity: number;
  }[];
  can_order_out_of_stock_items: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductMetaField {
  key: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  title: string;
  slug: string;
  description: string | null;
  product_class: string | null;
  product_type: string;
  created_at: string;
  updated_at: string;
  featured: boolean;
  brand: string | null;
  media: ProductMedia[];
  product_variants: ProductVariant[];
  meta_fields: ProductMetaField[];
}

export interface ProductListResponse {
  data: Product[];
  links: any[];
  meta: any;
}

export async function getProducts(params: Record<string, any> = {}): Promise<ProductListResponse> {
  const query = qs.stringify(params, { arrayFormat: 'comma', encode: false });
  const url = `${BASE_URL}/products${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProductBySlug(slug: string, params: Record<string, any> = {}): Promise<Product> {
  const query = qs.stringify(params, { arrayFormat: 'comma', encode: false });
  const url = `${BASE_URL}/products/${slug}${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
} 