#!/usr/bin/env node

/**
 * 🔧 数据库设置脚本
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 环境变量
const supabaseUrl = 'https://uxzycbjjzkdceqzhypdi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4enljYmpqemtkY2Vxemh5cGRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTc1MjA1OSwiZXhwIjoyMDY3MzI4MDU5fQ.p-bRfRl9UjmFRji7F0dnc-INyTrOyC_s5cZOvGNblrw';

async function setupDatabase() {
  console.log('🔧 开始设置数据库...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 读取SQL文件
    const sqlFile = path.join(__dirname, 'init-database.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // 分割SQL语句
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));
    
    console.log(`📝 执行 ${statements.length} 个SQL语句...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        console.log(`⚡ 执行语句 ${i + 1}/${statements.length}`);
        
        const { data, error } = await supabase.rpc('sql', {
          query: statement + ';'
        });
        
        if (error) {
          console.error(`❌ 语句执行失败: ${error.message}`);
          console.error(`SQL: ${statement.substring(0, 100)}...`);
        } else {
          console.log(`✅ 语句执行成功`);
        }
      }
    }
    
    // 验证数据
    const { data: products, error: productsError } = await supabase
      .from('lighting_products')
      .select('*');
    
    if (productsError) {
      console.error('❌ 验证产品数据失败:', productsError.message);
    } else {
      console.log(`🎉 数据库设置完成！产品数量: ${products.length}`);
      products.forEach(product => {
        console.log(`  ✓ ${product.name} (${product.brand}) - ¥${product.price}`);
      });
    }
    
  } catch (error) {
    console.error('❌ 设置失败:', error.message);
  }
}

setupDatabase();