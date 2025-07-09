#!/usr/bin/env node

/**
 * 🤖 MCP + SuperClaude 智能产品数据生成器
 * 自动生成50+真实、丰富的照明产品数据
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

// 🏗️ 架构师设计：智能产品数据结构
const brandTemplates = [
  { name: '飞利浦 (Philips)', priceMultiplier: 1.2, qualityTier: 'premium' },
  { name: '欧司朗 (OSRAM)', priceMultiplier: 1.15, qualityTier: 'premium' },
  { name: '松下 (Panasonic)', priceMultiplier: 1.1, qualityTier: 'high' },
  { name: '小米 (Xiaomi)', priceMultiplier: 0.8, qualityTier: 'value' },
  { name: '雷士照明 (NVC)', priceMultiplier: 0.9, qualityTier: 'mid' },
  { name: '三雄极光 (PAK)', priceMultiplier: 0.85, qualityTier: 'mid' },
  { name: '宜家 (IKEA)', priceMultiplier: 0.7, qualityTier: 'budget' }
]

const categoryTemplates = [
  {
    name: '吸顶灯',
    basePrice: 200,
    priceRange: [80, 800],
    features: ['现代设计', '节能', '可调光', '遥控', '智能控制'],
    rooms: ['客厅', '卧室', '书房'],
    specifications: {
      wattage: [18, 24, 36, 48],
      lumens: [1800, 2400, 3600, 4800],
      color_temperature: ['3000K', '4000K', '6500K', '3000K-6500K'],
      dimmable: [true, false],
      diameter: ['40cm', '50cm', '60cm', '80cm']
    }
  },
  {
    name: '吊灯',
    basePrice: 500,
    priceRange: [200, 2000],
    features: ['装饰性', '奢华', '欧式', '现代', '水晶'],
    rooms: ['客厅', '餐厅'],
    specifications: {
      wattage: [40, 60, 80, 100],
      lumens: [3000, 4500, 6000, 8000],
      color_temperature: ['2700K', '3000K'],
      dimmable: [true, false],
      height: ['50cm', '60cm', '80cm', '100cm']
    }
  },
  {
    name: '台灯',
    basePrice: 150,
    priceRange: [50, 500],
    features: ['护眼', '可调节', '触控', '无极调光', 'USB充电'],
    rooms: ['书房', '卧室', '办公室'],
    specifications: {
      wattage: [8, 12, 15, 18],
      lumens: [600, 900, 1200, 1500],
      color_temperature: ['2700K-6500K', '3000K-6000K'],
      dimmable: [true],
      height: ['35cm', '40cm', '45cm', '50cm']
    }
  },
  {
    name: '壁灯',
    basePrice: 120,
    priceRange: [60, 300],
    features: ['节省空间', '装饰性', '防水', '感应', '可调角度'],
    rooms: ['卧室', '走廊', '卫生间', '阳台'],
    specifications: {
      wattage: [6, 9, 12, 15],
      lumens: [500, 750, 1000, 1200],
      color_temperature: ['2700K', '3000K', '4000K'],
      dimmable: [true, false],
      size: ['15x10cm', '20x12cm', '25x15cm']
    }
  },
  {
    name: '射灯',
    basePrice: 80,
    priceRange: [30, 200],
    features: ['重点照明', '可调角度', '高亮度', '节能', '长寿命'],
    rooms: ['客厅', '展示区', '商业空间'],
    specifications: {
      wattage: [5, 7, 10, 12],
      lumens: [400, 600, 800, 1000],
      color_temperature: ['3000K', '4000K', '6500K'],
      beam_angle: ['15°', '24°', '36°', '60°'],
      dimmable: [true, false]
    }
  },
  {
    name: '筒灯',
    basePrice: 60,
    priceRange: [25, 150],
    features: ['嵌入式', '简洁', '防眩光', '节能', '免维护'],
    rooms: ['客厅', '厨房', '卫生间', '过道'],
    specifications: {
      wattage: [5, 7, 9, 12],
      lumens: [400, 600, 800, 1000],
      color_temperature: ['3000K', '4000K', '6500K'],
      diameter: ['7.5cm', '9cm', '12cm', '15cm'],
      cut_out: ['6cm', '7.5cm', '10cm', '12.5cm']
    }
  },
  {
    name: '落地灯',
    basePrice: 300,
    priceRange: [150, 800],
    features: ['装饰性', '移动灵活', '阅读照明', '氛围灯', '多档调节'],
    rooms: ['客厅', '卧室', '书房'],
    specifications: {
      wattage: [15, 20, 25, 30],
      lumens: [1200, 1600, 2000, 2400],
      color_temperature: ['2700K', '3000K', '2700K-6500K'],
      height: ['140cm', '150cm', '160cm', '170cm'],
      dimmable: [true, false]
    }
  },
  {
    name: '灯带',
    basePrice: 100,
    priceRange: [50, 300],
    features: ['RGB彩色', '防水', '可切割', '遥控', 'APP控制'],
    rooms: ['客厅', '卧室', '厨房', '装饰'],
    specifications: {
      wattage_per_meter: [4.8, 7.2, 9.6, 14.4],
      length: ['1m', '2m', '3m', '5m'],
      color_temperature: ['RGB', '3000K', '6500K', 'RGBW'],
      waterproof: ['IP20', 'IP65', 'IP67'],
      led_density: ['30/m', '60/m', '120/m']
    }
  }
]

// 📊 产品经理设计：真实产品名称模板
const productNameTemplates = {
  '吸顶灯': [
    'LED吸顶灯 现代简约圆形',
    '超薄LED吸顶灯 客厅卧室',
    '智能调光吸顶灯 遥控款',
    '星空吸顶灯 浪漫卧室',
    '方形LED吸顶灯 办公室',
    '水晶吸顶灯 奢华客厅',
    '木纹吸顶灯 北欧风格'
  ],
  '吊灯': [
    '欧式水晶吊灯 豪华客厅',
    '现代简约吊灯 餐厅专用',
    '工业风吊灯 复古铁艺',
    '北欧木质吊灯 原木色',
    '创意几何吊灯 艺术设计',
    '美式乡村吊灯 温馨家居',
    '中式古典吊灯 红木款'
  ],
  '台灯': [
    '护眼LED台灯 学习专用',
    '智能触控台灯 USB充电',
    '北欧简约台灯 卧室床头',
    '创意折叠台灯 便携式',
    '复古黄铜台灯 美式风格',
    '无线充电台灯 手机充电',
    '儿童卡通台灯 可爱动物'
  ],
  '壁灯': [
    '现代简约壁灯 卧室床头',
    '工业风壁灯 楼梯过道',
    '户外防水壁灯 阳台庭院',
    '感应壁灯 人体感应',
    '可调角度壁灯 阅读灯',
    '装饰壁灯 艺术造型',
    'LED镜前灯 卫生间专用'
  ],
  '射灯': [
    'LED轨道射灯 商用展示',
    '嵌入式射灯 客厅天花',
    '可调角度射灯 重点照明',
    '明装射灯 简约现代',
    '防眩光射灯 办公照明',
    'COB射灯 高显色指数',
    '智能射灯 调光调色'
  ],
  '筒灯': [
    'LED筒灯 超薄嵌入式',
    '防雾筒灯 卫生间专用',
    '可调角度筒灯 斜插款',
    '智能筒灯 语音控制',
    '防火筒灯 安全认证',
    'COB筒灯 无频闪',
    '彩色筒灯 RGB调色'
  ],
  '落地灯': [
    '北欧落地灯 客厅装饰',
    '阅读落地灯 护眼台灯',
    '创意落地灯 艺术造型',
    '遥控落地灯 智能调光',
    '钓鱼落地灯 可调高度',
    '复古落地灯 美式风格',
    '儿童落地灯 卡通造型'
  ],
  '灯带': [
    'RGB灯带 智能彩色',
    '防水灯带 户外装饰',
    '柔光灯带 间接照明',
    '感应灯带 衣柜橱柜',
    '音乐灯带 声控变色',
    '智能灯带 APP控制',
    '长寿命灯带 5万小时'
  ]
}

// 🤖 MCP：智能描述生成器
function generateProductDescription(category, name, brand, features, specs) {
  const templates = {
    '吸顶灯': [
      `${name}，采用${brand.name}先进LED技术，${features.slice(0,2).join('、')}设计。`,
      `适合${Math.random() > 0.5 ? '客厅' : '卧室'}使用，${specs.lumens}流明高亮度输出。`,
      `${specs.dimmable ? '支持无极调光，' : ''}色温${specs.color_temperature}，营造舒适照明环境。`,
      `超薄设计，简约时尚，是现代家居的理想选择。`
    ],
    '吊灯': [
      `${name}，${brand.name}精工制作，${features.slice(0,2).join('、')}工艺。`,
      `专为餐厅客厅设计，${specs.lumens}流明柔和光线，营造温馨氛围。`,
      `${specs.height}高度设计，适合2.8-3.2米层高空间。`,
      `优质材料制作，经久耐用，彰显品味。`
    ],
    '台灯': [
      `${name}，${brand.name}专业护眼技术，${features.slice(0,2).join('、')}功能。`,
      `${specs.color_temperature}色温可调，有效减少眼部疲劳。`,
      `${specs.dimmable ? '无极调光设计，' : ''}适合学习办公使用。`,
      `人性化设计，操作简便，是桌面照明的理想选择。`
    ],
    '壁灯': [
      `${name}，${brand.name}节能环保设计，${features.slice(0,2).join('、')}特点。`,
      `安装简便，适合卧室过道使用，${specs.lumens}流明柔和照明。`,
      `精美外观设计，既实用又装饰，提升空间美感。`,
      `优质LED芯片，寿命长达5万小时。`
    ],
    '射灯': [
      `${name}，${brand.name}专业照明解决方案，${features.slice(0,2).join('、')}设计。`,
      `${specs.beam_angle || '24°'}光束角，精准照明，突出重点区域。`,
      `高显色指数Ra>80，真实还原物体色彩。`,
      `适合商业展示和家居重点照明使用。`
    ],
    '筒灯': [
      `${name}，${brand.name}嵌入式照明专家，${features.slice(0,2).join('、')}特点。`,
      `超薄设计，完美融入天花板，${specs.lumens}流明均匀照明。`,
      `防眩光处理，保护视力，适合全屋照明使用。`,
      `安装简便，维护方便，是现代装修的首选。`
    ],
    '落地灯': [
      `${name}，${brand.name}移动照明解决方案，${features.slice(0,2).join('、')}设计。`,
      `${specs.height}高度，适合客厅卧室使用，营造温馨氛围。`,
      `稳固底座设计，安全可靠，${specs.dimmable ? '支持调光调色。' : '亮度适中。'}`,
      `既是照明工具，也是装饰艺术品。`
    ],
    '灯带': [
      `${name}，${brand.name}智能装饰照明，${features.slice(0,2).join('、')}功能。`,
      `${specs.length}长度，${specs.led_density}LED密度，均匀发光无暗区。`,
      `${specs.waterproof}防护等级，适合多种环境使用。`,
      `安装灵活，可切割拼接，创造无限照明可能。`
    ]
  }
  
  const categoryTemplates = templates[category] || templates['吸顶灯']
  return categoryTemplates.join(' ')
}

// 🚀 项目管理：批量数据生成主函数
async function generateRichProductData() {
  console.log('🤖 MCP + SuperClaude 智能产品数据生成开始...\n')
  
  try {
    // 1. 获取品牌和分类ID
    console.log('📊 获取基础数据...')
    const { data: brands } = await supabase.from('brands').select('id, name')
    const { data: categories } = await supabase.from('categories').select('id, name, name_en')
    
    if (!brands || !categories || brands.length === 0 || categories.length === 0) {
      console.log('❌ 缺少基础数据，请先执行database-setup.sql')
      return
    }
    
    console.log(`✅ 找到 ${brands.length} 个品牌，${categories.length} 个分类`)
    
    // 2. 生成产品数据
    const products = []
    let productCount = 0
    
    for (const category of categories) {
      const categoryTemplate = categoryTemplates.find(ct => ct.name === category.name)
      if (!categoryTemplate) continue
      
      const productNames = productNameTemplates[category.name] || []
      
      // 每个分类生成6-8个产品
      const productsPerCategory = Math.min(productNames.length, 7)
      
      for (let i = 0; i < productsPerCategory; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)]
        const brandTemplate = brandTemplates.find(bt => bt.name === brand.name) || brandTemplates[0]
        
        // 随机选择规格
        const specs = {}
        Object.keys(categoryTemplate.specifications).forEach(key => {
          const options = categoryTemplate.specifications[key]
          specs[key] = options[Math.floor(Math.random() * options.length)]
        })
        
        // 计算价格
        const basePrice = categoryTemplate.basePrice
        const priceVariation = (Math.random() - 0.5) * 0.4 // ±20%
        const brandAdjustedPrice = basePrice * brandTemplate.priceMultiplier * (1 + priceVariation)
        const finalPrice = Math.round(brandAdjustedPrice / 10) * 10 // 取整到10的倍数
        
        // 随机选择特性
        const selectedFeatures = categoryTemplate.features
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * 3) + 2)
        
        // 生成评分和评论数
        const baseRating = brandTemplate.qualityTier === 'premium' ? 4.3 : 
                          brandTemplate.qualityTier === 'high' ? 4.1 : 
                          brandTemplate.qualityTier === 'mid' ? 3.9 : 3.7
        const rating = Math.round((baseRating + (Math.random() - 0.5) * 0.6) * 10) / 10
        const reviewCount = Math.floor(Math.random() * 200) + 20
        
        // 生成产品名称
        const productName = productNames[i] || `${categoryTemplate.name} ${brand.name}款`
        
        // 生成描述
        const description = generateProductDescription(category.name, productName, brand, selectedFeatures, specs)
        
        // 生成图片URL (使用Unsplash)
        const imageQueries = {
          '吸顶灯': 'ceiling-light-modern',
          '吊灯': 'pendant-light-dining',
          '台灯': 'desk-lamp-modern',
          '壁灯': 'wall-sconce-light',
          '射灯': 'spotlight-track-lighting',
          '筒灯': 'recessed-light-ceiling',
          '落地灯': 'floor-lamp-living-room',
          '灯带': 'led-strip-lighting'
        }
        
        const imageQuery = imageQueries[category.name] || 'modern-lighting'
        const imageUrl = `https://images.unsplash.com/photo-${1500000000 + Math.floor(Math.random() * 100000000)}?w=400&q=80&auto=format&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5`
        
        // 生成联盟链接
        const affiliateLinks = {
          amazon: {
            url: `https://amazon.cn/dp/${Math.random().toString(36).substr(2, 10)}`,
            commission_rate: 0.08
          },
          jd: {
            url: `https://item.jd.com/${Math.floor(Math.random() * 1000000000)}.html`,
            commission_rate: 0.05
          },
          tmall: {
            url: `https://detail.tmall.com/item.htm?id=${Math.floor(Math.random() * 1000000000)}`,
            commission_rate: 0.06
          }
        }
        
        const product = {
          name: productName,
          brand_id: brand.id,
          category_id: category.id,
          description: description,
          price: finalPrice,
          original_price: Math.round(finalPrice * 1.2),
          specifications: specs,
          image_urls: [imageUrl],
          affiliate_links: affiliateLinks,
          commission_rate: Math.round(Math.random() * 3 + 4), // 4-7%
          rating: rating,
          review_count: reviewCount,
          view_count: Math.floor(Math.random() * 1000),
          favorite_count: Math.floor(Math.random() * 100),
          features: selectedFeatures,
          tags: [...selectedFeatures, category.name, brand.name.split(' ')[0]],
          is_featured: Math.random() > 0.7, // 30%几率成为特色产品
          is_available: true,
          stock_quantity: Math.floor(Math.random() * 500) + 50,
          status: 'active',
          seo_title: `${productName} - ${brand.name} ${category.name}`,
          seo_description: description.substring(0, 150),
          search_keywords: [productName, brand.name, category.name, ...selectedFeatures]
        }
        
        products.push(product)
        productCount++
      }
    }
    
    console.log(`🎯 生成了 ${products.length} 个产品`)
    
    // 3. 批量插入数据库
    console.log('💾 开始插入数据库...')
    
    const batchSize = 10
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      
      try {
        const { data, error } = await supabase
          .from('lighting_products')
          .insert(batch)
        
        if (error) {
          console.log(`❌ 批次 ${Math.floor(i/batchSize) + 1} 插入失败:`, error.message)
          errorCount += batch.length
        } else {
          console.log(`✅ 批次 ${Math.floor(i/batchSize) + 1} 插入成功 (${batch.length} 个产品)`)
          successCount += batch.length
        }
      } catch (err) {
        console.log(`❌ 批次 ${Math.floor(i/batchSize) + 1} 插入异常:`, err.message)
        errorCount += batch.length
      }
    }
    
    console.log(`\n📊 数据插入完成:`)
    console.log(`✅ 成功: ${successCount} 个产品`)
    console.log(`❌ 失败: ${errorCount} 个产品`)
    
    // 4. 验证插入结果
    const { count } = await supabase
      .from('lighting_products')
      .select('*', { count: 'exact', head: true })
    
    console.log(`\n🎉 数据库总产品数: ${count}`)
    
    // 5. 生成统计报告
    const { data: categoryStats } = await supabase
      .from('lighting_products')
      .select(`
        categories(name),
        count
      `)
      .eq('status', 'active')
    
    console.log('\n📈 分类统计:')
    const statsMap = {}
    for (const category of categories) {
      const { count: categoryCount } = await supabase
        .from('lighting_products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
      
      console.log(`  ${category.name}: ${categoryCount} 个产品`)
    }
    
    console.log('\n🚀 智能产品数据生成完成!')
    console.log('✨ 现在可以体验真实的产品推荐功能了!')
    
  } catch (error) {
    console.error('❌ 数据生成失败:', error.message)
  }
}

// 执行数据生成
generateRichProductData()