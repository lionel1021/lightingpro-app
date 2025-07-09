/**
 * 🗄️ 数据库操作封装 - 生产级数据库集成
 */

import { createClient } from '@supabase/supabase-js';
import { LightingProduct } from './types';

// 为了安全，仅在客户端使用匿名密钥
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 服务端安全客户端（仅用于服务器端操作）
export const createServerSupabaseClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('createServerSupabaseClient should only be used on the server side');
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

// 数据库类型定义
export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductWithRelations extends LightingProduct {
  brand?: Brand;
  category?: Category;
  affiliate_links?: Array<{
    platform: string;
    affiliate_url: string;
    commission_rate: number;
  }>;
}

/**
 * 产品数据库操作类
 */
export class ProductDatabase {
  
  /**
   * 获取所有产品（带分页）
   */
  static async getProducts(options: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    priceMin?: number;
    priceMax?: number;
    search?: string;
    featured?: boolean;
  } = {}): Promise<{
    products: ProductWithRelations[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 20,
      category,
      brand,
      priceMin,
      priceMax,
      search,
      featured
    } = options;

    let query = supabase
      .from('lighting_products')
      .select(`
        *,
        brands!inner(id, name, logo_url),
        categories!inner(id, name, description),
        affiliate_links(platform, affiliate_url, commission_rate)
      `)
      .eq('status', 'active');

    // 应用筛选条件
    if (category) {
      query = query.eq('categories.name', category);
    }

    if (brand) {
      query = query.eq('brands.name', brand);
    }

    if (priceMin !== undefined) {
      query = query.gte('price', priceMin);
    }

    if (priceMax !== undefined) {
      query = query.lte('price', priceMax);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (featured !== undefined) {
      query = query.eq('is_featured', featured);
    }

    // 获取总数
    const { count } = await query.select('*', { count: 'exact', head: true });
    const total = count || 0;

    // 获取分页数据
    const { data: products, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('获取产品失败:', error);
      throw new Error('获取产品数据失败');
    }

    return {
      products: products || [],
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * 根据ID获取单个产品
   */
  static async getProductById(id: string): Promise<ProductWithRelations | null> {
    const { data: product, error } = await supabase
      .from('lighting_products')
      .select(`
        *,
        brands(id, name, logo_url, description, website_url),
        categories(id, name, description),
        affiliate_links(platform, affiliate_url, commission_rate)
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('获取产品详情失败:', error);
      return null;
    }

    return product;
  }

  /**
   * 获取推荐产品
   */
  static async getRecommendedProducts(options: {
    room_type?: string;
    style_preference?: string;
    budget_min?: number;
    budget_max?: number;
    limit?: number;
  } = {}): Promise<ProductWithRelations[]> {
    const { room_type, style_preference, budget_min, budget_max, limit = 6 } = options;

    let query = supabase
      .from('lighting_products')
      .select(`
        *,
        brands(id, name, logo_url),
        categories(id, name, description),
        affiliate_links(platform, affiliate_url, commission_rate)
      `)
      .eq('status', 'active');

    // 根据房间类型筛选分类
    if (room_type) {
      const categoryMapping: Record<string, string[]> = {
        '客厅': ['吸顶灯', '吊灯', '射灯', '筒灯'],
        '卧室': ['吸顶灯', '台灯', '壁灯', '落地灯'],
        '书房': ['台灯', '射灯', '筒灯'],
        '餐厅': ['吊灯', '射灯'],
        '厨房': ['筒灯', '射灯'],
        '卫生间': ['吸顶灯', '壁灯', '筒灯']
      };

      const categories = categoryMapping[room_type];
      if (categories) {
        query = query.in('categories.name', categories);
      }
    }

    // 预算筛选
    if (budget_min !== undefined) {
      query = query.gte('price', budget_min);
    }
    if (budget_max !== undefined) {
      query = query.lte('price', budget_max);
    }

    // 按评分和特色排序
    const { data: products, error } = await query
      .order('rating', { ascending: false })
      .order('is_featured', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取推荐产品失败:', error);
      return [];
    }

    return products || [];
  }

  /**
   * 获取所有品牌
   */
  static async getBrands(): Promise<Brand[]> {
    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('获取品牌失败:', error);
      return [];
    }

    return brands || [];
  }

  /**
   * 获取所有分类
   */
  static async getCategories(): Promise<Category[]> {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('获取分类失败:', error);
      return [];
    }

    return categories || [];
  }

  /**
   * 搜索产品
   */
  static async searchProducts(
    query: string,
    options: {
      limit?: number;
      category?: string;
      priceMin?: number;
      priceMax?: number;
    } = {}
  ): Promise<ProductWithRelations[]> {
    const { limit = 20, category, priceMin, priceMax } = options;

    let searchQuery = supabase
      .from('lighting_products')
      .select(`
        *,
        brands(id, name, logo_url),
        categories(id, name, description),
        affiliate_links(platform, affiliate_url, commission_rate)
      `)
      .eq('status', 'active')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,features.cs.{${query}}`);

    // 应用额外筛选
    if (category) {
      searchQuery = searchQuery.eq('categories.name', category);
    }

    if (priceMin !== undefined) {
      searchQuery = searchQuery.gte('price', priceMin);
    }

    if (priceMax !== undefined) {
      searchQuery = searchQuery.lte('price', priceMax);
    }

    const { data: products, error } = await searchQuery
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('搜索产品失败:', error);
      return [];
    }

    return products || [];
  }

  /**
   * 获取热门产品
   */
  static async getFeaturedProducts(limit: number = 8): Promise<ProductWithRelations[]> {
    const { data: products, error } = await supabase
      .from('lighting_products')
      .select(`
        *,
        brands(id, name, logo_url),
        categories(id, name, description),
        affiliate_links(platform, affiliate_url, commission_rate)
      `)
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取热门产品失败:', error);
      return [];
    }

    return products || [];
  }

  /**
   * 统计数据
   */
  static async getStats(): Promise<{
    totalProducts: number;
    totalBrands: number;
    totalCategories: number;
    avgRating: number;
  }> {
    try {
      const [
        { count: totalProducts },
        { count: totalBrands },
        { count: totalCategories },
        { data: ratingData }
      ] = await Promise.all([
        supabase.from('lighting_products').select('*', { count: 'exact', head: true }),
        supabase.from('brands').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('lighting_products').select('rating').eq('status', 'active')
      ]);

      const avgRating = ratingData && ratingData.length > 0
        ? ratingData.reduce((sum, item) => sum + item.rating, 0) / ratingData.length
        : 0;

      return {
        totalProducts: totalProducts || 0,
        totalBrands: totalBrands || 0,
        totalCategories: totalCategories || 0,
        avgRating: Math.round(avgRating * 10) / 10
      };
    } catch (error) {
      console.error('获取统计数据失败:', error);
      return {
        totalProducts: 0,
        totalBrands: 0,
        totalCategories: 0,
        avgRating: 0
      };
    }
  }
}