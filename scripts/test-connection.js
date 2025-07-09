#!/usr/bin/env node

/**
 * 🔍 数据库连接测试脚本
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) env[match[1]] = match[2]
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function testConnection() {
  console.log('🔍 测试数据库连接...\n')
  
  console.log('📡 Supabase URL:', env.NEXT_PUBLIC_SUPABASE_URL ? '已配置' : '❌ 未配置')
  console.log('🔑 Service Key:', env.SUPABASE_SERVICE_ROLE_KEY ? '已配置' : '❌ 未配置')
  
  console.log('\n🧪 测试表访问:')
  
  const tables = ['brands', 'categories', 'lighting_products']
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count')
      
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`❌ ${table} - 表不存在`)
        } else {
          console.log(`⚠️  ${table} - 错误: ${error.message}`)
        }
      } else {
        console.log(`✅ ${table} - 表存在`)
      }
    } catch (err) {
      console.log(`🔴 ${table} - 异常: ${err.message}`)
    }
  }
  
  console.log('\n💡 如果所有表都不存在，请确认已在Supabase控制台执行了SQL脚本')
}

testConnection()