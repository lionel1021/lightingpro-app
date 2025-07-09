#!/usr/bin/env node

/**
 * 🔍 Supabase连接测试和数据库初始化
 */

const { createClient } = require('@supabase/supabase-js');

// 直接读取环境变量
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://uxzycbjjzkdceqzhypdi.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4enljYmpqemtkY2Vxemh5cGRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTc1MjA1OSwiZXhwIjoyMDY3MzI4MDU5fQ.p-bRfRl9UjmFRji7F0dnc-INyTrOyC_s5cZOvGNblrw';

async function testSupabaseConnection() {
  console.log('🔗 测试Supabase连接...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 缺少Supabase环境变量');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 测试连接
    const { data: testData, error: testError } = await supabase
      .from('lighting_products')
      .select('count', { count: 'exact', head: true });
    
    if (testError && testError.code === '42P01') {
      console.log('📋 表不存在，开始创建基础表结构...');
      await createBasicTables(supabase);
    } else if (testError) {
      console.error('❌ 连接错误:', testError.message);
      return;
    } else {
      console.log('✅ Supabase连接成功！');
      console.log(`📊 当前产品数量: ${testData?.length || 0}`);
    }
    
    // 插入测试数据
    await insertSampleData(supabase);
    
  } catch (error) {
    console.error('❌ 连接失败:', error.message);
  }
}

async function createBasicTables(supabase) {
  console.log('🏗️ 创建基础表结构...');
  
  // 创建lighting_products表
  const { error: productsError } = await supabase.rpc('sql', {
    query: `
      CREATE TABLE IF NOT EXISTS lighting_products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        category TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        specifications JSONB DEFAULT '{}',
        image_urls TEXT[] DEFAULT '{}',
        affiliate_links JSONB DEFAULT '{}',
        commission_rate DECIMAL(5,2) DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        features TEXT[] DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });
  
  if (productsError) {
    console.error('❌ 创建products表失败:', productsError.message);
  } else {
    console.log('✅ lighting_products表创建成功');
  }
  
  // 创建questionnaire_responses表
  const { error: questionnaireError } = await supabase.rpc('sql', {
    query: `
      CREATE TABLE IF NOT EXISTS questionnaire_responses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        room_type TEXT NOT NULL,
        room_size TEXT NOT NULL,
        style_preference TEXT NOT NULL,
        budget_range TEXT NOT NULL,
        current_lighting TEXT,
        special_requirements TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });
  
  if (questionnaireError) {
    console.error('❌ 创建questionnaire表失败:', questionnaireError.message);
  } else {
    console.log('✅ questionnaire_responses表创建成功');
  }
}

async function insertSampleData(supabase) {
  console.log('📊 插入示例产品数据...');
  
  const sampleProducts = [
    {
      name: 'LED吸顶灯 现代简约',
      brand: 'Philips',
      category: '吸顶灯',
      price: 299.00,
      description: '现代简约风格LED吸顶灯，适合客厅卧室使用，亮度可调节，节能环保。',
      specifications: {
        wattage: 36,
        lumens: 3600,
        color_temperature: '3000K-6500K',
        dimmable: true,
        smart_compatible: true
      },
      image_urls: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400'],
      affiliate_links: {
        amazon: 'https://amazon.cn/dp/example1',
        jd: 'https://item.jd.com/example1.html'
      },
      commission_rate: 5.5,
      rating: 4.5,
      review_count: 127,
      features: ['可调光', '智能控制', '节能', '现代设计']
    },
    {
      name: '水晶吊灯 欧式奢华',
      brand: 'OSRAM',
      category: '吊灯',
      price: 1299.00,
      description: '欧式奢华水晶吊灯，适合客厅餐厅，营造优雅氛围。',
      specifications: {
        wattage: 60,
        lumens: 4800,
        color_temperature: '2700K',
        dimmable: false,
        smart_compatible: false
      },
      image_urls: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
      affiliate_links: {
        amazon: 'https://amazon.cn/dp/example2',
        tmall: 'https://detail.tmall.com/example2.htm'
      },
      commission_rate: 8.0,
      rating: 4.3,
      review_count: 89,
      features: ['水晶装饰', '奢华设计', '高亮度', '欧式风格']
    },
    {
      name: '北欧风台灯 原木质感',
      brand: 'IKEA',
      category: '台灯',
      price: 199.00,
      description: '北欧风原木台灯，温馨舒适，适合卧室书房使用。',
      specifications: {
        wattage: 12,
        lumens: 800,
        color_temperature: '2700K',
        dimmable: true,
        smart_compatible: false
      },
      image_urls: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400'],
      affiliate_links: {
        ikea: 'https://www.ikea.cn/example3',
        amazon: 'https://amazon.cn/dp/example3'
      },
      commission_rate: 4.0,
      rating: 4.7,
      review_count: 203,
      features: ['原木材质', '北欧设计', '护眼光源', '可调光']
    }
  ];
  
  for (const product of sampleProducts) {
    const { error } = await supabase
      .from('lighting_products')
      .insert(product);
    
    if (error) {
      console.error(`❌ 插入产品失败: ${product.name}`, error.message);
    } else {
      console.log(`✅ 插入产品成功: ${product.name}`);
    }
  }
  
  // 检查最终数据
  const { data: finalCount, error: countError } = await supabase
    .from('lighting_products')
    .select('*', { count: 'exact' });
  
  if (!countError) {
    console.log(`🎉 数据库初始化完成！当前产品总数: ${finalCount?.length || 0}`);
  }
}

// 运行测试
testSupabaseConnection().catch(console.error);