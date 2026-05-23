import { supabase, isSupabaseConfigured } from './supabase';
import { Product, mockProducts } from './mockData';

/**
 * Fetches the active product inventory from Supabase.
 * Automatically falls back to mockData.ts if Supabase is unconfigured or offline.
 */
export async function fetchLiveProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    // If not configured, fail silently to mock data fallback
    return mockProducts;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, name, description, price, stock, image, category')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn('Supabase products table is empty. Using mock data.');
      return mockProducts;
    }

    // Map database models to the Product interface
    return data.map((item: any): Product => ({
      id: String(item.id),
      slug: item.slug,
      name: item.name,
      description: item.description || '',
      price: parseFloat(String(item.price || 0)),
      stock: parseInt(String(item.stock || 0), 10),
      image: item.image || '',
      category: item.category || undefined,
    }));
  } catch (err) {
    console.error('Failed to fetch products from Supabase, falling back to mock data:', err);
    return mockProducts;
  }
}
