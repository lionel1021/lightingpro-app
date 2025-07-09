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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Test database connection
const testConnection = async () => {
  console.log('🔗 Testing database connection...')
  
  try {
    const { data, error } = await supabase
      .from('lighting_products')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return false
    }
    
    console.log(`✅ Database connected. Found ${data} products`)
    return true
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return false
  }
}

// Check if affiliate tables exist
const checkAffiliateTablesExist = async () => {
  console.log('🔍 Checking affiliate tables...')
  
  try {
    const { data, error } = await supabase
      .from('affiliate_providers')
      .select('count', { count: 'exact', head: true })
    
    if (!error) {
      console.log('✅ Affiliate tables already exist')
      return true
    }
    
    console.log('ℹ️  Affiliate tables not found, need to create them')
    return false
  } catch (error) {
    console.log('ℹ️  Affiliate tables not found, need to create them')
    return false
  }
}

// Add affiliate data to existing products
const addAffiliateDataToProducts = async () => {
  console.log('🔗 Adding affiliate data to existing products...')
  
  try {
    // Update existing products with affiliate_links JSON
    const sampleAffiliateLinks = {
      amazon: {
        url: "https://amazon.com/lighting-product",
        commission_rate: 0.08
      },
      taobao: {
        url: "https://taobao.com/lighting-product", 
        commission_rate: 0.05
      },
      lighting_direct: {
        url: "https://lightingdirect.com/product",
        commission_rate: 0.12
      }
    }
    
    const { data: products, error: fetchError } = await supabase
      .from('lighting_products')
      .select('id, name')
      .limit(10)
    
    if (fetchError) {
      console.error('❌ Failed to fetch products:', fetchError.message)
      return false
    }
    
    if (!products || products.length === 0) {
      console.log('ℹ️  No products found to update')
      return true
    }
    
    // Update products with affiliate links
    for (const product of products) {
      const { error: updateError } = await supabase
        .from('lighting_products')
        .update({ 
          affiliate_links: sampleAffiliateLinks
        })
        .eq('id', product.id)
      
      if (updateError) {
        console.error(`❌ Failed to update product ${product.name}:`, updateError.message)
      } else {
        console.log(`✅ Updated affiliate links for: ${product.name}`)
      }
    }
    
    return true
  } catch (error) {
    console.error('❌ Failed to add affiliate data:', error.message)
    return false
  }
}

// Update database schema via direct column addition
const updateDatabaseSchema = async () => {
  console.log('📝 Updating database schema...')
  
  try {
    // Check if affiliate_links column exists on lighting_products
    const { data: products } = await supabase
      .from('lighting_products')
      .select('*')
      .limit(1)
    
    if (products && products.length > 0) {
      const product = products[0]
      if (!product.hasOwnProperty('affiliate_links')) {
        console.log('ℹ️  Need to add affiliate_links column to lighting_products')
        console.log('⚠️  Manual schema update required in Supabase dashboard')
        console.log('   SQL: ALTER TABLE lighting_products ADD COLUMN affiliate_links JSONB DEFAULT \'{}\';')
      } else {
        console.log('✅ affiliate_links column already exists')
      }
    }
    
    return true
  } catch (error) {
    console.error('❌ Schema check failed:', error.message)
    return false
  }
}

// Main function
const main = async () => {
  console.log('🚀 Starting database setup...')
  
  // Test connection
  const connected = await testConnection()
  if (!connected) {
    return
  }
  
  // Check schema
  await updateDatabaseSchema()
  
  // Check affiliate tables
  const affiliateTablesExist = await checkAffiliateTablesExist()
  
  if (!affiliateTablesExist) {
    console.log('📋 Next steps:')
    console.log('1. Go to Supabase Dashboard > SQL Editor')
    console.log('2. Run the migration file: supabase/migrations/005_affiliate_marketing.sql')
    console.log('3. Or use the manual SQL commands above')
  }
  
  // Add affiliate data to products
  await addAffiliateDataToProducts()
  
  console.log('✅ Database setup completed!')
}

main().catch(error => {
  console.error('❌ Setup failed:', error)
  process.exit(1)
})