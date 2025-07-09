// Featured Products Mock Data for Product Detail Pages
export const featuredProductsData = {
  '1': {
    id: '1',
    name: 'Philips Hue Play HDMI Sync Box + 2 Bulbs',
    price: 199.99,
    original_price: 249.99,
    rating: 4.9,
    review_count: 342,
    brand: { name: 'Philips' },
    category: { name: 'Smart Home Kit' },
    image_urls: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=800&fit=crop&crop=center&auto=format&q=80'
    ],
    description: 'Complete smart lighting kit with HDMI sync box that creates immersive entertainment lighting. Sync your lights with movies, games, and music for the ultimate home theater experience. Includes 2 Philips Hue Play light bars and HDMI sync box.',
    features: ['Voice Control', 'App Control', 'Color Changing', 'HDMI Sync', 'Works with Alexa', 'Works with Google'],
    stock_quantity: 15,
    currency: 'USD',
    is_featured: true,
    specifications: {
      'Light Output': '530 lumens per bar',
      'Color Temperature': '2000K - 6500K',
      'Connectivity': 'Zigbee 3.0, HDMI',
      'Power': '14W per bar',
      'Dimensions': '217 x 31 x 86 mm',
      'Warranty': '2 years'
    },
    affiliate_links: {
      philips: {
        url: 'https://www.philips-hue.com/en-us/products/smart-light-bars/hue-play-hdmi-sync-box-bundle',
        commission_rate: 0.05
      },
      amazon: {
        url: 'https://amazon.com/dp/B07GXB3S7Z',
        commission_rate: 0.04
      }
    }
  },
  '2': {
    id: '2',
    name: 'West Elm Sculptural Glass Globe Pendant',
    price: 149.99,
    original_price: 199.99,
    rating: 4.7,
    review_count: 128,
    brand: { name: 'West Elm' },
    category: { name: 'Pendant Lights' },
    image_urls: [
      'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=800&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=center&auto=format&q=80'
    ],
    description: 'Modern sculptural glass globe pendant light with brass hardware. Perfect for dining rooms, kitchens, and entryways. The clear glass globe creates beautiful light diffusion while the brass accents add warmth and elegance.',
    features: ['Dimmable', 'Brass Hardware', 'Glass Globe', 'Chain Adjustable', 'E26 Bulb Compatible'],
    stock_quantity: 8,
    currency: 'USD',
    is_featured: true,
    specifications: {
      'Globe Diameter': '10 inches',
      'Total Height': '15-63 inches (adjustable)',
      'Chain Length': '48 inches',
      'Bulb Type': 'E26 Medium Base',
      'Max Wattage': '60W',
      'Material': 'Glass, Brass'
    },
    affiliate_links: {
      westelm: {
        url: 'https://www.westelm.com/products/sculptural-glass-globe-pendant-brass/',
        commission_rate: 0.08
      },
      wayfair: {
        url: 'https://wayfair.com/lighting/pdp/west-elm-sculptural-glass-globe-pendant',
        commission_rate: 0.06
      }
    }
  },
  '3': {
    id: '3',
    name: 'Govee Immersion WiFi TV LED Strip 55-65"',
    price: 99.99,
    original_price: 129.99,
    rating: 4.8,
    review_count: 892,
    brand: { name: 'Govee' },
    category: { name: 'Smart LED Strips' },
    image_urls: [
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=800&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=center&auto=format&q=80'
    ],
    description: 'WiFi-enabled TV LED strip with camera for real-time screen color matching. Creates immersive ambient lighting that matches your TV content. Compatible with 55-65 inch TVs and works with Alexa and Google Assistant.',
    features: ['Camera Sync', 'WiFi Control', '16M Colors', 'Music Sync', 'App Control', 'Voice Control'],
    stock_quantity: 23,
    currency: 'USD',
    is_featured: false,
    specifications: {
      'Strip Length': '12.5 feet',
      'LED Count': '60 LEDs',
      'Connectivity': 'WiFi 2.4GHz',
      'Power': '24W',
      'TV Compatibility': '55-65 inches',
      'App': 'Govee Home'
    },
    affiliate_links: {
      govee: {
        url: 'https://govee.com/products/govee-immersion-wifi-tv-led-strip-lights',
        commission_rate: 0.12
      },
      amazon: {
        url: 'https://amazon.com/dp/B08LVPQZPX',
        commission_rate: 0.04
      }
    }
  },
  '4': {
    id: '4',
    name: 'Article Cerno Brass Table Lamp',
    price: 279.99,
    original_price: 329.99,
    rating: 4.6,
    review_count: 64,
    brand: { name: 'Article' },
    category: { name: 'Table Lamps' },
    image_urls: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=800&fit=crop&crop=center&auto=format&q=80'
    ],
    description: 'Mid-century modern brass table lamp with adjustable height and premium fabric shade. Features a sleek brass finish and white fabric drum shade that provides warm, diffused lighting perfect for reading or ambient lighting.',
    features: ['Brass Finish', 'Fabric Shade', 'Adjustable Height', 'E26 Bulb', 'Mid-Century Design'],
    stock_quantity: 12,
    currency: 'USD',
    is_featured: false,
    specifications: {
      'Height': '24-28 inches (adjustable)',
      'Shade Diameter': '16 inches',
      'Base Diameter': '8 inches',
      'Material': 'Brass, Fabric',
      'Bulb Type': 'E26 Medium Base',
      'Max Wattage': '60W'
    },
    affiliate_links: {
      article: {
        url: 'https://article.com/product/cerno-brass-table-lamp',
        commission_rate: 0.10
      },
      cb2: {
        url: 'https://cb2.com/article-cerno-brass-table-lamp',
        commission_rate: 0.07
      }
    }
  }
};

export function getFeaturedProduct(id: string) {
  return featuredProductsData[id as keyof typeof featuredProductsData] || null;
}

export function getAllFeaturedProducts() {
  return Object.values(featuredProductsData);
}