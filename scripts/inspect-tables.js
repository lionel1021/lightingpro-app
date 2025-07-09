#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables manually
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

// Inspect specific tables
const inspectTables = async () => {
  console.log('🔍 Inspecting table structure...')
  
  // Try different approaches to check tables
  const tablesToInspect = ['lighting_products', 'products', 'affiliate_providers']
  
  for (const tableName of tablesToInspect) {
    console.log(`\n📋 Checking table: ${tableName}`)
    
    try {
      // Try to get table info
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`)
      } else {
        console.log(`✅ ${tableName}: Accessible`)
        if (data && data.length > 0) {
          console.log('   Sample columns:', Object.keys(data[0]))
        } else {
          console.log('   Table is empty')
        }
      }
    } catch (err) {
      console.log(`❌ ${tableName}: ${err.message}`)
    }
  }
}

// Try to create a simple test
const testSimpleInsert = async () => {
  console.log('\n🧪 Testing simple operations...')
  
  // Test affiliate_providers first
  try {
    console.log('Testing affiliate_providers...')
    const { data: providers, error } = await supabase
      .from('affiliate_providers')
      .select('*')
      .limit(5)
    
    if (error) {
      console.log('❌ affiliate_providers error:', error.message)
    } else {
      console.log('✅ affiliate_providers works, found:', providers?.length || 0, 'providers')
      if (providers && providers.length > 0) {
        console.log('   Sample:', providers[0])
      }
    }
  } catch (err) {
    console.log('❌ affiliate_providers failed:', err.message)
  }
  
  // Try to insert a simple product using the exact table structure from migrations
  try {
    console.log('\nTesting lighting_products insert...')
    
    const testProduct = {
      sku: 'TEST-001',
      name: 'Test LED Light',
      brand_id: null, // We'll need to handle this
      category_id: null, // We'll need to handle this
      price: 99.99,
      description: 'Test description',
      rating: 4.5
    }
    
    const { data, error } = await supabase
      .from('lighting_products')
      .insert([testProduct])
      .select()
    
    if (error) {
      console.log('❌ Insert failed:', error.message)
      console.log('   Details:', error.details)
      console.log('   Hint:', error.hint)
    } else {
      console.log('✅ Test product inserted:', data)
    }
  } catch (err) {
    console.log('❌ Insert test failed:', err.message)
  }
}

const main = async () => {
  console.log('🔎 Database Table Inspector')
  console.log('===========================')
  
  await inspectTables()
  await testSimpleInsert()
  
  console.log('\n💡 Recommendations:')
  console.log('1. Check if the migration scripts have been run in Supabase Dashboard')
  console.log('2. Verify table structure matches the migration files')
  console.log('3. Check RLS policies are correctly configured')
}

main().catch(console.error)