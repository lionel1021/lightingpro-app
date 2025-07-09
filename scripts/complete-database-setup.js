#!/usr/bin/env node

/**
 * 🚀 完整数据库设置脚本
 * 创建表结构并填充数据
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 缺少Supabase配置')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 创建表的SQL命令
const createTablesSQL = `
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
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  currency TEXT DEFAULT 'CNY',
  specifications JSONB DEFAULT '{}',
  dimensions JSONB DEFAULT '{}',
  weight DECIMAL(8,3),
  image_urls TEXT[] DEFAULT '{}',
  video_urls TEXT[] DEFAULT '{}',
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
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'discontinued')),
  seo_title TEXT,
  seo_description TEXT,
  search_keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_lighting_products_brand_id ON lighting_products(brand_id);
CREATE INDEX IF NOT EXISTS idx_lighting_products_category_id ON lighting_products(category_id);
CREATE INDEX IF NOT EXISTS idx_lighting_products_price ON lighting_products(price);
CREATE INDEX IF NOT EXISTS idx_lighting_products_rating ON lighting_products(rating);
CREATE INDEX IF NOT EXISTS idx_lighting_products_status ON lighting_products(status);

-- 公共表的读取权限
CREATE POLICY IF NOT EXISTS "所有人都可以查看产品" ON lighting_products FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "所有人都可以查看品牌" ON brands FOR SELECT USING (true);  
CREATE POLICY IF NOT EXISTS "所有人都可以查看分类" ON categories FOR SELECT USING (true);
`

// 品牌数据
const brands = [
  { name: '飞利浦 (Philips)', description: '全球领先的照明品牌，以创新技术和高品质著称', logo_url: 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', website_url: 'https://www.philips.com.cn', country: 'Netherlands' },
  { name: '欧司朗 (OSRAM)', description: '德国专业照明制造商，技术领先的工业照明解决方案', logo_url: 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', website_url: 'https://www.osram.com.cn', country: 'Germany' },
  { name: '松下 (Panasonic)', description: '日本知名电器品牌，提供全方位的照明产品', logo_url: 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', website_url: 'https://www.panasonic.com.cn', country: 'Japan' },
  { name: '小米 (Xiaomi)', description: '智能家居生态链领导者，专注智能照明解决方案', logo_url: 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', website_url: 'https://www.mi.com', country: 'China' },
  { name: '雷士照明 (NVC)', description: '中国照明行业领导者，专业的照明解决方案提供商', logo_url: 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', website_url: 'https://www.nvc.com', country: 'China' },
  { name: '三雄极光 (PAK)', description: '中国知名照明品牌，专注LED照明产品', logo_url: 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', website_url: 'https://www.pak.com.cn', country: 'China' },
  { name: '宜家 (IKEA)', description: '瑞典家居品牌，提供简约实用的照明产品', logo_url: 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', website_url: 'https://www.ikea.cn', country: 'Sweden' }
]

// 分类数据
const categories = [
  { name: '吸顶灯', name_en: 'Ceiling Light', description: '安装在天花板上的主要照明设备，适合客厅、卧室等空间', icon_name: 'ceiling', sort_order: 1 },
  { name: '吊灯', name_en: 'Pendant Light', description: '悬挂式装饰照明灯具，营造优雅氛围', icon_name: 'pendant', sort_order: 2 },
  { name: '台灯', name_en: 'Table Lamp', description: '桌面使用的局部照明，适合阅读和工作', icon_name: 'table-lamp', sort_order: 3 },
  { name: '壁灯', name_en: 'Wall Light', description: '安装在墙壁上的装饰照明，节省空间', icon_name: 'wall-light', sort_order: 4 },
  { name: '射灯', name_en: 'Spotlight', description: '方向性强的重点照明，突出展示物品', icon_name: 'spotlight', sort_order: 5 },
  { name: '筒灯', name_en: 'Recessed Light', description: '嵌入式天花板照明，简洁美观', icon_name: 'recessed', sort_order: 6 },
  { name: '落地灯', name_en: 'Floor Lamp', description: '立式装饰照明灯具，移动灵活', icon_name: 'floor-lamp', sort_order: 7 },
  { name: '灯带', name_en: 'LED Strip', description: '柔性LED灯带，用于氛围照明和装饰', icon_name: 'led-strip', sort_order: 8 }
]

async function setupCompleteDatabase() {
  console.log('🚀 开始完整数据库设置...\n')

  try {
    // 1. 创建表结构
    console.log('🏗️  创建表结构...')
    const { error: createError } = await supabase.rpc('execute_sql', {
      sql: createTablesSQL
    })

    if (createError) {
      console.error('❌ 创建表结构失败:', createError)
      // 尝试单独创建表
      console.log('🔄 尝试单独创建表...')
      
      // 尝试直接插入数据，如果表不存在会自动创建
      console.log('📦 尝试创建品牌表...')
      await supabase.from('brands').insert({ name: 'test' }).then(result => {
        console.log('品牌表测试:', result.error ? result.error.message : 'OK')
      })
    } else {
      console.log('✅ 表结构创建成功')
    }

    // 2. 插入品牌数据
    console.log('📦 插入品牌数据...')
    let brandInsertResult = await supabase.from('brands').insert(brands)
    
    if (brandInsertResult.error) {
      console.log('⚠️  品牌数据插入遇到问题:', brandInsertResult.error.message)
      // 尝试单条插入
      console.log('🔄 尝试单条插入品牌数据...')
      for (const brand of brands) {
        const { error } = await supabase.from('brands').insert(brand)
        if (error && !error.message.includes('duplicate')) {
          console.log(`❌ 插入品牌 ${brand.name} 失败:`, error.message)
        } else {
          console.log(`✅ 插入品牌 ${brand.name} 成功`)
        }
      }
    } else {
      console.log('✅ 品牌数据插入成功')
    }

    // 3. 插入分类数据
    console.log('📂 插入分类数据...')
    let categoryInsertResult = await supabase.from('categories').insert(categories)
    
    if (categoryInsertResult.error) {
      console.log('⚠️  分类数据插入遇到问题:', categoryInsertResult.error.message)
      // 尝试单条插入
      console.log('🔄 尝试单条插入分类数据...')
      for (const category of categories) {
        const { error } = await supabase.from('categories').insert(category)
        if (error && !error.message.includes('duplicate')) {
          console.log(`❌ 插入分类 ${category.name} 失败:`, error.message)
        } else {
          console.log(`✅ 插入分类 ${category.name} 成功`)
        }
      }
    } else {
      console.log('✅ 分类数据插入成功')
    }

    // 4. 验证数据
    console.log('\n📊 验证数据...')
    const { data: finalBrands, error: brandsError } = await supabase.from('brands').select('name')
    const { data: finalCategories, error: categoriesError } = await supabase.from('categories').select('name')

    if (brandsError) {
      console.log('⚠️  品牌数据验证失败:', brandsError.message)
    } else {
      console.log(`✅ 品牌总数: ${finalBrands?.length || 0}`)
      if (finalBrands?.length > 0) {
        console.log(`   示例品牌: ${finalBrands.slice(0, 3).map(b => b.name).join(', ')}`)
      }
    }

    if (categoriesError) {
      console.log('⚠️  分类数据验证失败:', categoriesError.message)
    } else {
      console.log(`✅ 分类总数: ${finalCategories?.length || 0}`)
      if (finalCategories?.length > 0) {
        console.log(`   示例分类: ${finalCategories.slice(0, 3).map(c => c.name).join(', ')}`)
      }
    }

    console.log('\n🎉 数据库设置完成!')
    
    if (finalBrands?.length > 0 && finalCategories?.length > 0) {
      console.log('🚀 现在可以运行产品数据生成脚本了')
      console.log('   执行: node scripts/generate-rich-product-data.js')
    } else {
      console.log('⚠️  请先在Supabase控制台手动执行database-setup.sql创建完整表结构')
    }

  } catch (error) {
    console.error('❌ 数据库设置失败:', error.message)
    console.log('\n🔧 手动解决方案:')
    console.log('1. 打开Supabase控制台 SQL编辑器')
    console.log('2. 复制并执行 database-setup.sql 文件内容')
    console.log('3. 重新运行此脚本')
  }
}

setupCompleteDatabase()