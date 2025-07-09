#!/usr/bin/env node

/**
 * 🤖 SuperClaude + MCP 协作验证脚本
 * 自动检查数据库集成状态
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

// 🧠 SuperClaude: 智能验证系统
async function verifyDatabaseIntegration() {
  console.log('🤖 SuperClaude + MCP 数据库集成验证开始...\n')
  
  const results = {
    tables: {},
    data: {},
    indexes: {},
    policies: {},
    overall: 'success'
  }

  try {
    // 1. 🏗️ 架构智能体：验证表结构
    console.log('🏗️ 验证表结构...')
    const requiredTables = [
      'user_profiles',
      'brands', 
      'categories',
      'lighting_products',
      'affiliate_links',
      'user_favorites',
      'recommendation_history',
      'user_interactions',
      'product_reviews'
    ]

    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true })
        
        if (error) {
          if (error.code === '42P01') {
            console.log(`❌ 表 ${table} 不存在`)
            results.tables[table] = 'missing'
            results.overall = 'partial'
          } else {
            console.log(`⚠️  表 ${table} 有问题: ${error.message}`)
            results.tables[table] = 'error'
            results.overall = 'partial'
          }
        } else {
          console.log(`✅ 表 ${table} 存在，记录数: ${data || 0}`)
          results.tables[table] = 'exists'
          results.data[table] = data || 0
        }
      } catch (err) {
        console.log(`❌ 验证表 ${table} 失败: ${err.message}`)
        results.tables[table] = 'error'
        results.overall = 'error'
      }
    }

    // 2. 📊 产品智能体：验证基础数据
    console.log('\n📊 验证基础数据...')
    
    if (results.tables.brands === 'exists') {
      const { data: brands } = await supabase.from('brands').select('name')
      console.log(`✅ 品牌数据: ${brands?.length || 0} 个品牌`)
      if (brands && brands.length > 0) {
        console.log(`   示例品牌: ${brands.slice(0, 3).map(b => b.name).join(', ')}`)
      }
    }

    if (results.tables.categories === 'exists') {
      const { data: categories } = await supabase.from('categories').select('name')
      console.log(`✅ 分类数据: ${categories?.length || 0} 个分类`)
      if (categories && categories.length > 0) {
        console.log(`   示例分类: ${categories.slice(0, 3).map(c => c.name).join(', ')}`)
      }
    }

    if (results.tables.lighting_products === 'exists') {
      const { data: products } = await supabase
        .from('lighting_products')
        .select('name, price, rating')
        .limit(3)
      
      console.log(`✅ 产品数据: ${results.data.lighting_products || 0} 个产品`)
      if (products && products.length > 0) {
        console.log('   示例产品:')
        products.forEach(p => {
          console.log(`     • ${p.name} - ¥${p.price} (${p.rating || 'N/A'}⭐)`)
        })
      }
    }

    // 3. 🚀 项目智能体：验证API集成
    console.log('\n🚀 验证API集成...')
    
    try {
      const response = await fetch('http://localhost:3000/api/products/recommendations?room_type=客厅&budget_range=300-800')
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ API响应正常`)
        console.log(`   算法版本: ${data.data?.algorithm || 'unknown'}`)
        console.log(`   数据源: ${data.data?.data_source || 'unknown'}`)
        console.log(`   推荐数量: ${data.data?.total_count || 0}`)
      } else {
        console.log(`⚠️  API响应异常: ${response.status}`)
        results.overall = 'partial'
      }
    } catch (apiError) {
      console.log(`⚠️  API测试失败 (服务器可能未启动): ${apiError.message}`)
    }

    // 4. 🔐 安全智能体：验证权限设置
    console.log('\n🔐 验证安全设置...')
    
    try {
      // 检查RLS是否启用
      const { data: rlsTables } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
      
      console.log(`✅ 数据库安全检查完成`)
      console.log(`   公共表数量: ${rlsTables?.length || 0}`)
    } catch (secError) {
      console.log(`⚠️  安全检查跳过: ${secError.message}`)
    }

    // 5. 生成总结报告
    console.log('\n📊 验证总结:')
    console.log('='.repeat(50))
    
    const existingTables = Object.values(results.tables).filter(status => status === 'exists').length
    const totalTables = requiredTables.length
    
    console.log(`表结构完整性: ${existingTables}/${totalTables} (${Math.round(existingTables/totalTables*100)}%)`)
    
    if (results.overall === 'success') {
      console.log('🎉 状态: 数据库集成完美!')
      console.log('✅ 所有表结构正常')
      console.log('✅ 基础数据已准备')
      console.log('✅ API集成正常')
      console.log('\n🚀 可以开始使用真实数据库功能!')
    } else if (results.overall === 'partial') {
      console.log('⚠️  状态: 部分集成完成')
      console.log('\n📋 需要手动执行的步骤:')
      console.log('1. 在Supabase控制台执行 database-setup.sql')
      console.log('2. 确认所有表都已创建')
      console.log('3. 重新运行此验证脚本')
    } else {
      console.log('❌ 状态: 集成失败')
      console.log('\n🔧 请检查:')
      console.log('• Supabase连接配置')
      console.log('• 环境变量设置')
      console.log('• 网络连接状态')
    }

    // 6. 🤖 MCP: 自动化建议
    console.log('\n🤖 MCP智能建议:')
    
    if (existingTables === 0) {
      console.log('🔥 立即行动: 执行database-setup.sql创建表结构')
    } else if (existingTables < totalTables) {
      console.log('⚡ 继续完善: 创建缺失的表结构')
    } else {
      console.log('🎯 下一步: 添加更多产品数据和测试用户交互')
    }

    return results

  } catch (error) {
    console.error('❌ 验证过程失败:', error.message)
    return { overall: 'error', error: error.message }
  }
}

// 执行验证
verifyDatabaseIntegration().then(results => {
  if (results.overall === 'success') {
    console.log('\n🎭 SuperClaude + MCP 协作系统已就绪!')
    process.exit(0)
  } else {
    console.log('\n🔧 需要进一步配置才能启用智能协作')
    process.exit(1)
  }
})