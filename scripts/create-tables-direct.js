#!/usr/bin/env node

/**
 * 🏗️ 通过直接API调用创建表结构
 * 绕过SQL执行限制，使用Supabase管理API
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

// 测试并创建基础数据
async function createBasicData() {
  console.log('🏗️ 开始创建基础数据...')
  
  try {
    // 1. 创建品牌数据
    console.log('📋 创建品牌数据...')
    const brandsData = [
      { name: 'Philips', description: '全球领先的照明品牌', logo_url: 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', website_url: 'https://www.philips.com' },
      { name: 'OSRAM', description: '德国专业照明制造商', logo_url: 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', website_url: 'https://www.osram.com' },
      { name: 'Panasonic', description: '日本知名电器品牌', logo_url: 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', website_url: 'https://www.panasonic.com' },
      { name: '小米', description: '智能家居生态链', logo_url: 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', website_url: 'https://www.mi.com' },
      { name: '雷士照明', description: '中国照明行业领导者', logo_url: 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', website_url: 'https://www.nvc.com' }
    ]
    
    // 尝试插入品牌数据
    for (const brand of brandsData) {
      try {
        const { error: brandError } = await supabase
          .from('brands')
          .insert(brand)
        
        if (brandError && !brandError.message.includes('duplicate key')) {
          console.log(`⚠️  创建品牌失败: ${brand.name} - ${brandError.message}`)
        } else {
          console.log(`✅ 创建品牌: ${brand.name}`)
        }
      } catch (err) {
        console.log(`❌ 品牌插入错误: ${brand.name} - ${err.message}`)
      }
    }
    
    // 2. 创建分类数据
    console.log('📂 创建分类数据...')
    const categoriesData = [
      { name: '吸顶灯', description: '安装在天花板上的主要照明设备', sort_order: 1 },
      { name: '吊灯', description: '悬挂式装饰照明灯具', sort_order: 2 },
      { name: '台灯', description: '桌面使用的局部照明', sort_order: 3 },
      { name: '壁灯', description: '安装在墙壁上的装饰照明', sort_order: 4 },
      { name: '射灯', description: '方向性强的重点照明', sort_order: 5 },
      { name: '筒灯', description: '嵌入式天花板照明', sort_order: 6 },
      { name: '落地灯', description: '立式装饰照明灯具', sort_order: 7 },
      { name: '智能照明', description: '可调节智能控制灯具', sort_order: 8 }
    ]
    
    for (const category of categoriesData) {
      try {
        const { error: categoryError } = await supabase
          .from('categories')
          .insert(category)
        
        if (categoryError && !categoryError.message.includes('duplicate key')) {
          console.log(`⚠️  创建分类失败: ${category.name} - ${categoryError.message}`)
        } else {
          console.log(`✅ 创建分类: ${category.name}`)
        }
      } catch (err) {
        console.log(`❌ 分类插入错误: ${category.name} - ${err.message}`)
      }
    }
    
    // 3. 获取品牌和分类ID
    const { data: brands } = await supabase.from('brands').select('id, name')
    const { data: categories } = await supabase.from('categories').select('id, name')
    
    if (!brands || !categories) {
      console.log('⚠️  无法获取品牌和分类数据，跳过产品创建')
      return
    }
    
    // 4. 创建产品数据
    console.log('🛍️ 创建产品数据...')
    const brandMap = Object.fromEntries(brands.map(b => [b.name, b.id]))
    const categoryMap = Object.fromEntries(categories.map(c => [c.name, c.id]))
    
    const productsData = [
      {
        name: 'LED吸顶灯 现代简约',
        brand_id: brandMap['Philips'],
        category_id: categoryMap['吸顶灯'],
        description: '现代简约风格LED吸顶灯，适合客厅卧室使用，亮度可调节，节能环保。',
        price: 299.00,
        specifications: {
          wattage: 36,
          lumens: 3600,
          color_temperature: '3000K-6500K',
          dimmable: true,
          smart_compatible: true
        },
        image_urls: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400'],
        affiliate_links: {
          amazon: { url: 'https://amazon.cn/dp/example1', commission_rate: 0.08 },
          jd: { url: 'https://item.jd.com/example1.html', commission_rate: 0.05 }
        },
        commission_rate: 5.5,
        rating: 4.5,
        review_count: 127,
        features: ['可调光', '智能控制', '节能', '现代设计'],
        is_featured: true
      },
      {
        name: '欧式水晶吊灯',
        brand_id: brandMap['OSRAM'],
        category_id: categoryMap['吊灯'],
        description: '豪华欧式水晶吊灯，适合大厅和餐厅使用，营造奢华氛围。',
        price: 1299.00,
        specifications: {
          wattage: 60,
          lumens: 4800,
          color_temperature: '3000K',
          dimmable: false,
          smart_compatible: false
        },
        image_urls: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400'],
        affiliate_links: {
          amazon: { url: 'https://amazon.cn/dp/example2', commission_rate: 0.10 },
          tmall: { url: 'https://detail.tmall.com/item.htm?id=example2', commission_rate: 0.06 }
        },
        commission_rate: 8.0,
        rating: 4.3,
        review_count: 89,
        features: ['水晶装饰', '欧式风格', '豪华', '餐厅专用'],
        is_featured: true
      },
      {
        name: '智能护眼台灯',
        brand_id: brandMap['小米'],
        category_id: categoryMap['台灯'],
        description: '智能护眼台灯，支持App控制，自动调节亮度，保护视力健康。',
        price: 399.00,
        specifications: {
          wattage: 12,
          lumens: 1200,
          color_temperature: '2700K-6500K',
          dimmable: true,
          smart_compatible: true
        },
        image_urls: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
        affiliate_links: {
          mi: { url: 'https://www.mi.com/product/example3', commission_rate: 0.12 },
          jd: { url: 'https://item.jd.com/example3.html', commission_rate: 0.08 }
        },
        commission_rate: 7.5,
        rating: 4.7,
        review_count: 234,
        features: ['护眼', '智能控制', 'App控制', '学习专用'],
        is_featured: true
      },
      {
        name: '北欧简约壁灯',
        brand_id: brandMap['Panasonic'],
        category_id: categoryMap['壁灯'],
        description: '北欧简约风格壁灯，适合卧室和走廊使用，营造温馨氛围。',
        price: 189.00,
        specifications: {
          wattage: 8,
          lumens: 800,
          color_temperature: '3000K',
          dimmable: true,
          smart_compatible: false
        },
        image_urls: ['https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?w=400'],
        affiliate_links: {
          amazon: { url: 'https://amazon.cn/dp/example4', commission_rate: 0.07 },
          tmall: { url: 'https://detail.tmall.com/item.htm?id=example4', commission_rate: 0.05 }
        },
        commission_rate: 6.0,
        rating: 4.2,
        review_count: 156,
        features: ['北欧风格', '温馨', '节能', '卧室专用'],
        is_featured: false
      },
      {
        name: 'LED射灯组合',
        brand_id: brandMap['雷士照明'],
        category_id: categoryMap['射灯'],
        description: '专业LED射灯组合，适合商业和家居重点照明，角度可调节。',
        price: 99.00,
        specifications: {
          wattage: 7,
          lumens: 700,
          color_temperature: '4000K',
          dimmable: false,
          smart_compatible: false
        },
        image_urls: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'],
        affiliate_links: {
          jd: { url: 'https://item.jd.com/example5.html', commission_rate: 0.06 },
          tmall: { url: 'https://detail.tmall.com/item.htm?id=example5', commission_rate: 0.04 }
        },
        commission_rate: 4.5,
        rating: 4.1,
        review_count: 78,
        features: ['角度调节', '重点照明', '商用', '高性价比'],
        is_featured: false
      }
    ]
    
    for (const product of productsData) {
      try {
        const { error: productError } = await supabase
          .from('lighting_products')
          .insert(product)
        
        if (productError) {
          console.log(`⚠️  创建产品失败: ${product.name} - ${productError.message}`)
        } else {
          console.log(`✅ 创建产品: ${product.name}`)
        }
      } catch (err) {
        console.log(`❌ 产品插入错误: ${product.name} - ${err.message}`)
      }
    }
    
    console.log('\n🎉 基础数据创建完成！')
    return true
    
  } catch (error) {
    console.error('❌ 基础数据创建失败:', error.message)
    return false
  }
}

// 验证数据
async function verifyData() {
  console.log('\n🔍 验证数据...')
  
  try {
    // 检查各表的数据
    const tables = ['brands', 'categories', 'lighting_products']
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`❌ 表 ${table} 查询失败: ${error.message}`)
      } else {
        console.log(`✅ 表 ${table} 记录数: ${count || 0}`)
      }
    }
    
    // 显示示例产品
    const { data: products } = await supabase
      .from('lighting_products')
      .select(`
        name, price, rating, 
        brands(name),
        categories(name)
      `)
      .limit(3)
    
    if (products && products.length > 0) {
      console.log('\n🛍️ 示例产品:')
      products.forEach(product => {
        console.log(`  • ${product.name} (${product.brands?.name}) - ¥${product.price} (${product.rating}⭐)`)
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
  console.log('🚀 开始数据库数据创建...')
  
  const success = await createBasicData()
  if (success) {
    await verifyData()
    console.log('\n✅ 数据库数据创建完成！')
    console.log('🎯 现在可以测试推荐系统和产品展示功能了')
  } else {
    console.log('\n⚠️  数据创建遇到问题，请检查Supabase表结构')
  }
}

main().catch(console.error)