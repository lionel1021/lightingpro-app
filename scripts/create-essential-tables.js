#!/usr/bin/env node

/**
 * 🏗️ 创建核心表结构
 * 直接通过SQL创建生产就绪的表结构
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) {
    env[match[1]] = match[2]
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 核心表结构SQL
const createTablesSQL = `
-- 用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- 品牌表
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 照明产品表
CREATE TABLE IF NOT EXISTS lighting_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand_id UUID REFERENCES brands(id),
  category_id UUID REFERENCES categories(id),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  specifications JSONB DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  affiliate_links JSONB DEFAULT '{}',
  commission_rate DECIMAL(5,2) DEFAULT 0.0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 联盟链接表
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES lighting_products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 0.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(product_id, platform)
);

-- 用户收藏表
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES lighting_products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, product_id)
);

-- 推荐历史表
CREATE TABLE IF NOT EXISTS recommendation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  questionnaire_data JSONB,
  recommended_products UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_lighting_products_brand_id ON lighting_products(brand_id);
CREATE INDEX IF NOT EXISTS idx_lighting_products_category_id ON lighting_products(category_id);
CREATE INDEX IF NOT EXISTS idx_lighting_products_price ON lighting_products(price);
CREATE INDEX IF NOT EXISTS idx_lighting_products_rating ON lighting_products(rating);
CREATE INDEX IF NOT EXISTS idx_lighting_products_status ON lighting_products(status);
CREATE INDEX IF NOT EXISTS idx_lighting_products_featured ON lighting_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_product_id ON affiliate_links(product_id);

-- 启用行级安全 (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_history ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
CREATE POLICY IF NOT EXISTS "用户只能查看自己的资料" ON user_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "用户只能管理自己的收藏" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "用户只能查看自己的推荐历史" ON recommendation_history
  FOR ALL USING (auth.uid() = user_id);

-- 公共表的读取权限
CREATE POLICY IF NOT EXISTS "所有人都可以查看产品" ON lighting_products
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "所有人都可以查看品牌" ON brands
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "所有人都可以查看分类" ON categories
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "所有人都可以查看联盟链接" ON affiliate_links
  FOR SELECT USING (true);
`;

// 插入基础数据
const insertBaseDataSQL = `
-- 插入品牌数据
INSERT INTO brands (name, description, logo_url, website_url) VALUES
('Philips', '全球领先的照明品牌', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.philips.com'),
('OSRAM', '德国专业照明制造商', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.osram.com'),
('Panasonic', '日本知名电器品牌', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.panasonic.com'),
('小米', '智能家居生态链', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.mi.com'),
('雷士照明', '中国照明行业领导者', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.nvc.com')
ON CONFLICT (name) DO NOTHING;

-- 插入分类数据
INSERT INTO categories (name, description, sort_order) VALUES
('吸顶灯', '安装在天花板上的主要照明设备', 1),
('吊灯', '悬挂式装饰照明灯具', 2),
('台灯', '桌面使用的局部照明', 3),
('壁灯', '安装在墙壁上的装饰照明', 4),
('射灯', '方向性强的重点照明', 5),
('筒灯', '嵌入式天花板照明', 6),
('落地灯', '立式装饰照明灯具', 7),
('智能照明', '可调节智能控制灯具', 8)
ON CONFLICT (name) DO NOTHING;
`;

// 插入示例产品数据
const insertProductsSQL = `
-- 插入示例产品
INSERT INTO lighting_products (
  name, brand_id, category_id, description, price, 
  specifications, image_urls, affiliate_links, 
  commission_rate, rating, review_count, features, is_featured
) VALUES
(
  'LED吸顶灯 现代简约', 
  (SELECT id FROM brands WHERE name = 'Philips' LIMIT 1),
  (SELECT id FROM categories WHERE name = '吸顶灯' LIMIT 1),
  '现代简约风格LED吸顶灯，适合客厅卧室使用，亮度可调节，节能环保。',
  299.00,
  '{"wattage": 36, "lumens": 3600, "color_temperature": "3000K-6500K", "dimmable": true, "smart_compatible": true}',
  '["https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400"]',
  '{"amazon": {"url": "https://amazon.cn/dp/example1", "commission_rate": 0.08}, "jd": {"url": "https://item.jd.com/example1.html", "commission_rate": 0.05}}',
  5.5,
  4.5,
  127,
  '["可调光", "智能控制", "节能", "现代设计"]',
  true
),
(
  '欧式水晶吊灯', 
  (SELECT id FROM brands WHERE name = 'OSRAM' LIMIT 1),
  (SELECT id FROM categories WHERE name = '吊灯' LIMIT 1),
  '豪华欧式水晶吊灯，适合大厅和餐厅使用，营造奢华氛围。',
  1299.00,
  '{"wattage": 60, "lumens": 4800, "color_temperature": "3000K", "dimmable": false, "smart_compatible": false}',
  '["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400"]',
  '{"amazon": {"url": "https://amazon.cn/dp/example2", "commission_rate": 0.10}, "tmall": {"url": "https://detail.tmall.com/item.htm?id=example2", "commission_rate": 0.06}}',
  8.0,
  4.3,
  89,
  '["水晶装饰", "欧式风格", "豪华", "餐厅专用"]',
  true
),
(
  '智能护眼台灯', 
  (SELECT id FROM brands WHERE name = '小米' LIMIT 1),
  (SELECT id FROM categories WHERE name = '台灯' LIMIT 1),
  '智能护眼台灯，支持App控制，自动调节亮度，保护视力健康。',
  399.00,
  '{"wattage": 12, "lumens": 1200, "color_temperature": "2700K-6500K", "dimmable": true, "smart_compatible": true}',
  '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"]',
  '{"mi": {"url": "https://www.mi.com/product/example3", "commission_rate": 0.12}, "jd": {"url": "https://item.jd.com/example3.html", "commission_rate": 0.08}}',
  7.5,
  4.7,
  234,
  '["护眼", "智能控制", "App控制", "学习专用"]',
  true
)
ON CONFLICT DO NOTHING;
`;

// 执行数据库操作
async function createTables() {
  console.log('🏗️ 创建核心表结构...')
  
  try {
    // 创建表结构
    console.log('📋 创建表结构...')
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: createTablesSQL
    })
    
    if (tableError) {
      console.error('❌ 创建表结构失败:', tableError.message)
      console.log('⚠️  请手动在Supabase SQL编辑器中执行以下SQL:')
      console.log(createTablesSQL)
      return false
    }
    
    console.log('✅ 表结构创建成功')
    
    // 插入基础数据
    console.log('📊 插入基础数据...')
    const { error: dataError } = await supabase.rpc('exec_sql', {
      sql: insertBaseDataSQL
    })
    
    if (dataError) {
      console.error('❌ 插入基础数据失败:', dataError.message)
      console.log('⚠️  请手动在Supabase SQL编辑器中执行基础数据SQL')
    } else {
      console.log('✅ 基础数据插入成功')
    }
    
    // 插入产品数据
    console.log('🛍️ 插入产品数据...')
    const { error: productError } = await supabase.rpc('exec_sql', {
      sql: insertProductsSQL
    })
    
    if (productError) {
      console.error('❌ 插入产品数据失败:', productError.message)
      console.log('⚠️  请手动在Supabase SQL编辑器中执行产品数据SQL')
    } else {
      console.log('✅ 产品数据插入成功')
    }
    
    return true
    
  } catch (error) {
    console.error('❌ 数据库操作失败:', error.message)
    console.log('\n📋 手动创建步骤:')
    console.log('1. 打开 Supabase 控制台')
    console.log('2. 进入 SQL 编辑器')
    console.log('3. 执行上述SQL语句')
    return false
  }
}

// 验证表创建
async function verifyTables() {
  console.log('🔍 验证表创建...')
  
  try {
    // 检查主要表
    const tables = ['user_profiles', 'brands', 'categories', 'lighting_products', 'affiliate_links', 'user_favorites']
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`❌ 表 ${table} 不存在或有错误:`, error.message)
      } else {
        console.log(`✅ 表 ${table} 存在，记录数: ${count || 0}`)
      }
    }
    
    // 检查产品数据
    const { data: products, error: productsError } = await supabase
      .from('lighting_products')
      .select('name, price, rating')
      .limit(3)
    
    if (products && products.length > 0) {
      console.log('\n🛍️ 示例产品:')
      products.forEach(product => {
        console.log(`  • ${product.name} - ¥${product.price} (${product.rating}⭐)`)
      })
    }
    
    return true
  } catch (error) {
    console.error('❌ 验证失败:', error.message)
    return false
  }
}

// 主函数
async function main() {
  console.log('🚀 开始数据库初始化...')
  
  const success = await createTables()
  if (success) {
    await verifyTables()
    console.log('\n🎉 数据库初始化完成！')
    console.log('📊 现在可以测试应用的完整功能了')
  } else {
    console.log('\n⚠️  数据库初始化未完成，请手动创建表结构')
  }
}

main().catch(console.error)