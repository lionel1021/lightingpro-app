#!/usr/bin/env node

/**
 * 🧠 智能数据库设置脚本
 * 检测表是否存在，如果不存在则显示创建指令
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// 加载环境变量
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

async function smartSetup() {
  console.log('🧠 SuperClaude 智能数据库设置...\n')

  // 检测表是否存在
  console.log('🔍 检测表结构...')
  const { data, error } = await supabase.from('brands').select('count')

  if (error && error.message.includes('does not exist')) {
    console.log('❌ 数据库表尚未创建')
    console.log('\n📋 请按以下步骤手动创建表结构:\n')
    
    console.log('🌐 1. 打开 Supabase 控制台:')
    console.log('   https://supabase.com/dashboard\n')
    
    console.log('📝 2. 进入 SQL Editor 并执行以下脚本:\n')
    console.log('==================== 复制以下内容到 SQL Editor ====================')
    
    const sql = `
-- 创建品牌表
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  country TEXT DEFAULT 'China',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_en TEXT,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  image_url TEXT,
  icon_name TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 创建产品表
CREATE TABLE IF NOT EXISTS lighting_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  brand_id UUID REFERENCES brands(id),
  category_id UUID REFERENCES categories(id),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  currency TEXT DEFAULT 'CNY',
  specifications JSONB DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  affiliate_links JSONB DEFAULT '{}',
  commission_rate DECIMAL(5,2) DEFAULT 0.0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 999,
  status TEXT DEFAULT 'active',
  seo_title TEXT,
  seo_description TEXT,
  search_keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 启用行级安全
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;  
ALTER TABLE lighting_products ENABLE ROW LEVEL SECURITY;

-- 创建公共读取策略
CREATE POLICY "公共读取品牌" ON brands FOR SELECT USING (true);
CREATE POLICY "公共读取分类" ON categories FOR SELECT USING (true);
CREATE POLICY "公共读取产品" ON lighting_products FOR SELECT USING (true);

-- 插入品牌数据
INSERT INTO brands (name, description, logo_url, website_url, country) VALUES
('飞利浦 (Philips)', '全球领先的照明品牌，以创新技术和高品质著称', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.philips.com.cn', 'Netherlands'),
('欧司朗 (OSRAM)', '德国专业照明制造商，技术领先的工业照明解决方案', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.osram.com.cn', 'Germany'),
('松下 (Panasonic)', '日本知名电器品牌，提供全方位的照明产品', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.panasonic.com.cn', 'Japan'),
('小米 (Xiaomi)', '智能家居生态链领导者，专注智能照明解决方案', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.mi.com', 'China'),
('雷士照明 (NVC)', '中国照明行业领导者，专业的照明解决方案提供商', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.nvc.com', 'China'),
('三雄极光 (PAK)', '中国知名照明品牌，专注LED照明产品', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.pak.com.cn', 'China'),
('宜家 (IKEA)', '瑞典家居品牌，提供简约实用的照明产品', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.ikea.cn', 'Sweden')
ON CONFLICT (name) DO NOTHING;

-- 插入分类数据
INSERT INTO categories (name, name_en, description, icon_name, sort_order) VALUES
('吸顶灯', 'Ceiling Light', '安装在天花板上的主要照明设备，适合客厅、卧室等空间', 'ceiling', 1),
('吊灯', 'Pendant Light', '悬挂式装饰照明灯具，营造优雅氛围', 'pendant', 2),
('台灯', 'Table Lamp', '桌面使用的局部照明，适合阅读和工作', 'table-lamp', 3),
('壁灯', 'Wall Light', '安装在墙壁上的装饰照明，节省空间', 'wall-light', 4),
('射灯', 'Spotlight', '方向性强的重点照明，突出展示物品', 'spotlight', 5),
('筒灯', 'Recessed Light', '嵌入式天花板照明，简洁美观', 'recessed', 6),
('落地灯', 'Floor Lamp', '立式装饰照明灯具，移动灵活', 'floor-lamp', 7),
('灯带', 'LED Strip', '柔性LED灯带，用于氛围照明和装饰', 'led-strip', 8)
ON CONFLICT (name) DO NOTHING;`

    console.log(sql)
    console.log('\n====================================================================\n')
    
    console.log('⚡ 3. 执行完成后运行验证:')
    console.log('   node scripts/smart-setup.js\n')
    
    console.log('🚀 4. 验证成功后生成产品数据:')
    console.log('   node scripts/generate-rich-product-data.js\n')
    
  } else if (error) {
    console.log('❌ 数据库连接错误:', error.message)
  } else {
    console.log('✅ 数据库表已存在，检查数据...')
    
    // 检查品牌数据
    const { data: brands } = await supabase.from('brands').select('name')
    console.log(`📦 品牌数据: ${brands?.length || 0} 个`)
    
    // 检查分类数据  
    const { data: categories } = await supabase.from('categories').select('name')
    console.log(`📂 分类数据: ${categories?.length || 0} 个`)
    
    // 检查产品数据
    const { data: products } = await supabase.from('lighting_products').select('name')
    console.log(`💡 产品数据: ${products?.length || 0} 个`)
    
    if (brands?.length > 0 && categories?.length > 0) {
      if (products?.length === 0) {
        console.log('\n🎯 基础数据已准备，可以生成产品数据!')
        console.log('执行: node scripts/generate-rich-product-data.js')
      } else {
        console.log('\n🎉 数据库已完全设置，应用已就绪!')
        console.log('可以在 http://localhost:3000 查看应用')
      }
    } else {
      console.log('\n⚠️  基础数据缺失，需要重新执行SQL脚本')
    }
  }
}

smartSetup()