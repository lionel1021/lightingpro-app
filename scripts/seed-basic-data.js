#!/usr/bin/env node

/**
 * 🌱 基础数据种子脚本
 * 填充品牌和分类数据
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

async function seedBasicData() {
  console.log('🌱 开始填充基础数据...\n')

  try {
    // 1. 插入品牌数据
    console.log('📦 插入品牌数据...')
    const { data: brandData, error: brandError } = await supabase
      .from('brands')
      .insert(brands)
      .select()

    if (brandError) {
      console.error('❌ 品牌数据插入失败:', brandError)
      return
    }

    console.log(`✅ 成功插入 ${brandData.length} 个品牌`)

    // 2. 插入分类数据
    console.log('📂 插入分类数据...')
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .insert(categories)
      .select()

    if (categoryError) {
      console.error('❌ 分类数据插入失败:', categoryError)
      return
    }

    console.log(`✅ 成功插入 ${categoryData.length} 个分类`)

    // 3. 验证数据
    console.log('\n📊 验证数据...')
    const { data: finalBrands } = await supabase.from('brands').select('name')
    const { data: finalCategories } = await supabase.from('categories').select('name')

    console.log(`✅ 品牌总数: ${finalBrands?.length || 0}`)
    console.log(`✅ 分类总数: ${finalCategories?.length || 0}`)

    console.log('\n🎉 基础数据填充完成!')
    console.log('🚀 现在可以运行产品数据生成脚本了')

  } catch (error) {
    console.error('❌ 填充基础数据失败:', error.message)
  }
}

seedBasicData()