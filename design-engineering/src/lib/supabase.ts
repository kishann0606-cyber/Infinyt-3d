import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types — match actual DB schema
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  product_count: number | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string; // text column, not FK
  technology: string | null;
  build_volume: string | null;
  layer_resolution: string | null;
  price: number;
  image_url: string | null;
  images: string[];
  badges: string[];
  specifications: Record<string, string>;
  features: string[];
  description: string | null;
  short_description: string | null;
  downloads: Array<{ name: string; url: string }>;
  warranty: string | null;
  related_products: string[];
  faqs: Array<{ question: string; answer: string }>;
  in_stock: boolean;
  featured: boolean;
  product_type: string | null;
  tags: string[];
  created_at: string;
  updated_at: string | null;
}

// Fetch all categories from product_categories table
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

// Fetch products with optional filters
export async function getProducts(options?: {
  category?: string;
  brand?: string;
  featured?: boolean;
  limit?: number;
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*');

  if (options?.category) {
    query = query.eq('category', options.category);
  }

  if (options?.brand) {
    query = query.eq('brand', options.brand);
  }

  if (options?.featured) {
    query = query.eq('featured', true);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}

export async function getBrands(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('brand');

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  const brands = [...new Set(data?.map(p => p.brand) || [])];
  return brands.sort();
}
