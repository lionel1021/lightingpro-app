/**
 * 🔐 服务器端Supabase配置 - 安全数据库操作
 */

import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig, isDemoMode } from './demo-mode';

// 确保只在服务器端使用
if (typeof window !== 'undefined') {
  throw new Error('This module should only be used on the server side');
}

// 获取配置
const config = getSupabaseConfig();

// 使用服务角色密钥的安全客户端
export const supabaseAdmin = createClient(
  config.url,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo_service_key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// 用于API路由的安全操作
export const createServerSupabaseClient = () => {
  if (isDemoMode()) {
    // 在演示模式下返回模拟客户端
    return {
      from: (table: string) => ({
        select: (columns?: string, options?: any) => ({
          eq: () => ({ data: [], error: null }),
          gte: () => ({ data: [], error: null }),
          order: () => ({ data: [], error: null }),
          limit: () => ({ data: [], error: null }),
          count: 0,
          head: true
        }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null })
      }),
      auth: {
        getUser: () => ({ data: { user: null }, error: null })
      }
    };
  }
  
  return createClient(
    config.url,
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo_service_key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

// 兼容性导出
export const createSupabaseClient = createServerSupabaseClient;