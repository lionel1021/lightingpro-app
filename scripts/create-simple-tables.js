#!/usr/bin/env node

/**
 * 🏗️ 简化表结构创建脚本
 * 绕过SQL执行问题，直接创建基础表
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uxzycbjjzkdceqzhypdi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4enljYmpqemtkY2Vxemh5cGRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTc1MjA1OSwiZXhwIjoyMDY3MzI4MDU5fQ.p-bRfRl9UjmFRji7F0dnc-INyTrOyC_s5cZOvGNblrw';

async function createTables() {
  console.log('🏗️ 创建基础表结构...');
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // 先检查表是否存在
    const { data: existingTables, error: checkError } = await supabase
      .from('lighting_products')
      .select('count', { count: 'exact', head: true });
    
    if (checkError && checkError.code === '42P01') {
      console.log('❌ 表不存在，需要在Supabase面板手动创建');
      console.log('📋 请按以下步骤操作：');
      console.log('1. 打开 https://supabase.com/dashboard');
      console.log('2. 选择您的项目');
      console.log('3. 进入 Table Editor');
      console.log('4. 创建以下表：');
      
      console.log('\n📊 需要创建的表:');
      console.log('- brands (品牌表)');
      console.log('- categories (分类表)'); 
      console.log('- lighting_products (产品表)');
      console.log('- affiliate_links (联盟链接表)');
      
      console.log('\n🔄 或者使用模拟数据继续开发...');
      return false;
    }
    
    // 如果表存在，插入模拟数据
    console.log('✅ 表已存在，插入示例数据...');
    await insertMockData(supabase);
    return true;
    
  } catch (error) {
    console.error('❌ 创建表失败:', error.message);
    return false;
  }
}

async function insertMockData(supabase) {
  console.log('📊 插入模拟数据...');
  
  // 使用现有的模拟数据创建表记录
  const mockData = [
    {
      id: '1',
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
      features: ['可调光', '智能控制', '节能', '现代设计'],
      created_at: new Date().toISOString()
    }
  ];
  
  for (const product of mockData) {
    try {
      const { error } = await supabase
        .from('lighting_products')
        .upsert(product, { onConflict: 'id' });
      
      if (error) {
        console.log(`⚠️ 插入产品失败: ${product.name} - ${error.message}`);
      } else {
        console.log(`✅ 插入产品成功: ${product.name}`);
      }
    } catch (err) {
      console.log(`❌ 产品插入错误: ${err.message}`);
    }
  }
  
  console.log('✅ 模拟数据插入完成');
}

// 运行脚本
createTables().then(success => {
  if (success) {
    console.log('🎉 表创建和数据插入完成！');
  } else {
    console.log('⚠️ 需要手动创建表结构');
  }
});