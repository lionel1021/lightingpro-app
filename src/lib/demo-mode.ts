// 演示模式配置
// 当没有真实的 Supabase 配置时，使用模拟数据

export const isDemoMode = () => {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo') ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('localhost')
  );
};

// 演示用的 Supabase 配置
export const demoSupabaseConfig = {
  url: 'https://demo.supabase.co',
  anonKey: 'demo_anon_key'
};

// 获取 Supabase 配置
export const getSupabaseConfig = () => {
  if (isDemoMode()) {
    return demoSupabaseConfig;
  }
  
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  };
};

// 检查是否为生产环境
export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

// 演示模式警告
export const showDemoWarning = () => {
  if (isDemoMode() && typeof window !== 'undefined') {
    console.warn('🚧 当前运行在演示模式下，某些功能可能不可用。');
  }
};