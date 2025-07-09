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

// Sample lighting products with affiliate links
const sampleProducts = [
  {
    name: 'Modern LED Ceiling Light',
    brand: 'PHILIPS',
    category: 'Ceiling Lights',
    price: 299.99,
    description: 'Energy-efficient LED ceiling light with smart control and modern design',
    rating: 4.5,
    specifications: {
      power: '36W',
      lumens: '3600lm',
      color_temperature: '3000K-6500K',
      dimmable: true,
      smart_control: true
    },
    image_urls: [
      'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
    ],
    affiliate_links: {
      amazon: {
        url: 'https://amazon.com/philips-led-ceiling-light',
        commission_rate: 0.08
      },
      taobao: {
        url: 'https://taobao.com/philips-ceiling-light',
        commission_rate: 0.05
      },
      lighting_direct: {
        url: 'https://lightingdirect.com/philips-led',
        commission_rate: 0.12
      }
    }
  },
  {
    name: 'Industrial Pendant Light',
    brand: 'WEST ELM',
    category: 'Pendant Lights',
    price: 189.99,
    description: 'Vintage industrial style pendant light with bronze finish',
    rating: 4.3,
    specifications: {
      power: '60W',
      material: 'Metal',
      finish: 'Bronze',
      style: 'Industrial',
      cord_length: '6ft'
    },
    image_urls: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500'
    ],
    affiliate_links: {
      amazon: {
        url: 'https://amazon.com/west-elm-pendant',
        commission_rate: 0.08
      },
      jd: {
        url: 'https://jd.com/west-elm-industrial',
        commission_rate: 0.04
      }
    }
  },
  {
    name: 'Crystal Chandelier',
    brand: 'RESTORATION HARDWARE',
    category: 'Chandeliers',
    price: 899.99,
    description: 'Elegant crystal chandelier with 8 lights, perfect for dining rooms',
    rating: 4.7,
    specifications: {
      power: '8x40W',
      material: 'Crystal & Metal',
      finish: 'Chrome',
      style: 'Traditional',
      dimensions: '30" W x 24" H'
    },
    image_urls: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'
    ],
    affiliate_links: {
      amazon: {
        url: 'https://amazon.com/restoration-hardware-chandelier',
        commission_rate: 0.08
      },
      lighting_direct: {
        url: 'https://lightingdirect.com/crystal-chandelier',
        commission_rate: 0.12
      }
    }
  },
  {
    name: 'Smart RGB Floor Lamp',
    brand: 'GOVEE',
    category: 'Floor Lamps',
    price: 159.99,
    description: 'WiFi-enabled RGB floor lamp with app control and voice assistant compatibility',
    rating: 4.4,
    specifications: {
      power: '20W',
      colors: '16 million colors',
      smart_control: true,
      voice_control: true,
      app_control: true,
      height: '58 inches'
    },
    image_urls: [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
    ],
    affiliate_links: {
      amazon: {
        url: 'https://amazon.com/govee-smart-floor-lamp',
        commission_rate: 0.08
      },
      tmall: {
        url: 'https://tmall.com/govee-rgb-lamp',
        commission_rate: 0.06
      }
    }
  },
  {
    name: 'Under Cabinet LED Strip',
    brand: 'KICHLER',
    category: 'Task Lighting',
    price: 79.99,
    description: 'Linkable LED under cabinet lighting with warm white output',
    rating: 4.2,
    specifications: {
      power: '12W',
      length: '24 inches',
      color_temperature: '3000K',
      dimmable: true,
      linkable: true,
      installation: 'Plug-in or hardwired'
    },
    image_urls: [
      'https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?w=500',
      'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=500'
    ],
    affiliate_links: {
      amazon: {
        url: 'https://amazon.com/kichler-under-cabinet',
        commission_rate: 0.08
      },
      lighting_direct: {
        url: 'https://lightingdirect.com/kichler-led',
        commission_rate: 0.12
      }
    }
  },
  {
    name: 'Outdoor Solar Path Lights',
    brand: 'SOLAR BRIGHT',
    category: 'Outdoor Lighting',
    price: 49.99,
    description: 'Set of 6 solar-powered LED path lights with automatic on/off',
    rating: 4.1,
    specifications: {
      power: 'Solar powered',
      quantity: '6 lights',
      material: 'Stainless steel',
      weather_resistant: true,
      auto_on_off: true,
      battery_life: '8-10 hours'
    },
    image_urls: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'https://images.unsplash.com/photo-1615529162924-f1faa8b10118?w=500'
    ],
    affiliate_links: {
      amazon: {
        url: 'https://amazon.com/solar-bright-path-lights',
        commission_rate: 0.08
      },
      jd: {
        url: 'https://jd.com/solar-path-lights',
        commission_rate: 0.04
      }
    }
  }
]

// Insert sample products
const seedProducts = async () => {
  console.log('🌱 Seeding sample products with affiliate links...')
  
  try {
    // Check if products already exist
    const { data: existingProducts } = await supabase
      .from('lighting_products')
      .select('name')
      .limit(1)
    
    if (existingProducts && existingProducts.length > 0) {
      console.log('✅ Products already exist, skipping seed')
      return true
    }
    
    // Insert products one by one to handle errors gracefully
    let successCount = 0
    for (const product of sampleProducts) {
      try {
        const { data, error } = await supabase
          .from('lighting_products')
          .insert([product])
          .select('id, name')
        
        if (error) {
          console.error(`❌ Failed to insert ${product.name}:`, error.message)
        } else {
          console.log(`✅ Inserted: ${product.name}`)
          successCount++
        }
      } catch (err) {
        console.error(`❌ Error inserting ${product.name}:`, err.message)
      }
    }
    
    console.log(`🎉 Successfully inserted ${successCount}/${sampleProducts.length} products`)
    return true
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    return false
  }
}

// Create affiliate links in the new table structure
const seedAffiliateLinks = async () => {
  console.log('🔗 Creating affiliate links...')
  
  try {
    // Get all products
    const { data: products, error } = await supabase
      .from('lighting_products')
      .select('id, name, affiliate_links')
    
    if (error || !products) {
      console.error('❌ Failed to fetch products:', error?.message)
      return false
    }
    
    let linkCount = 0
    for (const product of products) {
      if (product.affiliate_links) {
        const affiliateLinks = product.affiliate_links
        
        for (const [providerId, linkData] of Object.entries(affiliateLinks)) {
          try {
            const { error: linkError } = await supabase
              .from('affiliate_links')
              .insert([{
                product_id: product.id,
                provider_id: providerId,
                original_url: linkData.url,
                affiliate_url: linkData.url,
                commission_rate: linkData.commission_rate,
                priority: 1,
                status: 'active'
              }])
            
            if (linkError) {
              console.error(`❌ Failed to create link for ${product.name} - ${providerId}:`, linkError.message)
            } else {
              linkCount++
            }
          } catch (err) {
            console.error(`❌ Error creating link:`, err.message)
          }
        }
      }
    }
    
    console.log(`🎉 Created ${linkCount} affiliate links`)
    return true
  } catch (error) {
    console.error('❌ Failed to create affiliate links:', error.message)
    return false
  }
}

// Main seeding function
const main = async () => {
  console.log('🚀 Starting affiliate data seeding...')
  
  // Seed products
  const productsSeeded = await seedProducts()
  if (!productsSeeded) {
    return
  }
  
  // Seed affiliate links
  await seedAffiliateLinks()
  
  console.log('✅ Affiliate data seeding completed!')
  console.log('\n📋 Next steps:')
  console.log('1. Test the search API: /api/products/search')
  console.log('2. Test affiliate link generation: /api/affiliate/generate')
  console.log('3. Check the products in your app: /search')
}

main().catch(error => {
  console.error('❌ Seeding failed:', error)
  process.exit(1)
})