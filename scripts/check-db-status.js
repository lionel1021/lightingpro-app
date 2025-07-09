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

// Check what tables exist
const checkTables = async () => {
  console.log('🔍 Checking database tables...')
  
  const tablesToCheck = [
    'lighting_products',
    'brands',
    'categories', 
    'user_profiles',
    'questionnaire_responses',
    'affiliate_providers',
    'affiliate_links'
  ]
  
  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true })
      
      if (error) {
        console.log(`❌ Table '${table}': ${error.message}`)
      } else {
        console.log(`✅ Table '${table}': ${data !== null ? data + ' rows' : 'exists'}`)
      }
    } catch (error) {
      console.log(`❌ Table '${table}': ${error.message}`)
    }
  }
}

// Create basic tables if they don't exist
const createBasicTables = async () => {
  console.log('🏗️  Creating basic tables...')
  
  // Create a simple products table for testing
  try {
    const { error } = await supabase
      .from('lighting_products')
      .insert([
        {
          name: 'Modern LED Ceiling Light',
          brand: 'LightTech',
          category: 'Ceiling Lights',
          price: 299.99,
          description: 'Energy-efficient LED ceiling light with modern design',
          rating: 4.5
        }
      ])
    
    if (error) {
      console.log('ℹ️  Products table needs to be created via SQL')
      console.log('   Run this SQL in Supabase Dashboard:')
      console.log(`
CREATE TABLE lighting_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  affiliate_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
      `)
    } else {
      console.log('✅ Sample product inserted')
    }
  } catch (error) {
    console.log('ℹ️  Need to create products table first')
  }
}

const main = async () => {
  console.log('📋 Database Status Check')
  console.log('========================')
  
  await checkTables()
  
  console.log('\n🔧 Setup Recommendations:')
  console.log('1. Go to Supabase Dashboard > SQL Editor')
  console.log('2. Run the migration files in order:')
  console.log('   - supabase/migrations/001_initial_schema.sql')
  console.log('   - supabase/migrations/005_affiliate_marketing.sql')
  console.log('3. Then run the seed data script')
  
  await createBasicTables()
}

main().catch(console.error)