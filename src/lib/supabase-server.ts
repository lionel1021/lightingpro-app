/**
 * 🔐 服务器端Supabase配置 - 安全数据库操作
 */

import { createClient } from '@supabase/supabase-js';

// 确保只在服务器端使用
if (typeof window !== 'undefined') {
  throw new Error('This module should only be used on the server side');
}

// 使用服务角色密钥的安全客户端
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// 用于API路由的安全操作
export const createServerSupabaseClient = () => {
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

// 兼容性导出
export const createSupabaseClient = createServerSupabaseClient;