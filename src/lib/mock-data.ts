/**
 * 🎭 模拟数据 - 开发阶段使用
 * 在数据库未就绪时提供完整的产品数据
 */

import { LightingProduct } from './types';

export const mockProducts: LightingProduct[] = [
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
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
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
    features: ['水晶装饰', '奢华设计', '高亮度', '欧式风格'],
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
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
    features: ['原木材质', '北欧设计', '护眼光源', '可调光'],
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'LED筒灯 嵌入式',
    brand: 'Panasonic',
    category: '筒灯',
    price: 89.00,
    description: '嵌入式LED筒灯，适合天花板安装，节能高效。',
    specifications: {
      wattage: 9,
      lumens: 900,
      color_temperature: '4000K',
      dimmable: false,
      smart_compatible: false
    },
    image_urls: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
    affiliate_links: {
      amazon: 'https://amazon.cn/dp/example4',
      suning: 'https://product.suning.com/example4.html'
    },
    commission_rate: 6.0,
    rating: 4.2,
    review_count: 156,
    features: ['嵌入式', '节能', '高亮度', '简约'],
    created_at: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: '创意壁灯 工业风',
    brand: 'Industrial',
    category: '壁灯',
    price: 159.00,
    description: '工业风创意壁灯，金属质感，适合现代简约风格装修。',
    specifications: {
      wattage: 15,
      lumens: 1200,
      color_temperature: '2700K',
      dimmable: true,
      smart_compatible: false
    },
    image_urls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    affiliate_links: {
      amazon: 'https://amazon.cn/dp/example5',
      taobao: 'https://item.taobao.com/example5.htm'
    },
    commission_rate: 7.5,
    rating: 4.6,
    review_count: 98,
    features: ['工业风格', '金属材质', '创意设计', '可调光'],
    created_at: '2024-01-05T00:00:00Z'
  },
  {
    id: '6',
    name: '智能彩色灯带',
    brand: 'Xiaomi',
    category: '灯带',
    price: 129.00,
    description: '智能RGB灯带，支持APP控制，1600万色彩，适合氛围照明。',
    specifications: {
      wattage: 24,
      lumens: 1500,
      color_temperature: 'RGB',
      dimmable: true,
      smart_compatible: true
    },
    image_urls: ['https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400'],
    affiliate_links: {
      xiaomi: 'https://www.mi.com/example6',
      amazon: 'https://amazon.cn/dp/example6'
    },
    commission_rate: 5.0,
    rating: 4.4,
    review_count: 234,
    features: ['智能控制', 'RGB彩色', 'APP控制', '氛围照明'],
    created_at: '2024-01-06T00:00:00Z'
  },
  {
    id: '7',
    name: '复古吊扇灯',
    brand: 'Vintage',
    category: '吊扇灯',
    price: 899.00,
    description: '复古风格吊扇灯，照明与通风一体，适合大空间使用。',
    specifications: {
      wattage: 42,
      lumens: 3200,
      color_temperature: '3000K',
      dimmable: true,
      smart_compatible: false
    },
    image_urls: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
    affiliate_links: {
      amazon: 'https://amazon.cn/dp/example7',
      home_depot: 'https://homedepot.com/example7'
    },
    commission_rate: 9.0,
    rating: 4.1,
    review_count: 67,
    features: ['复古风格', '吊扇功能', '大空间适用', '可调光'],
    created_at: '2024-01-07T00:00:00Z'
  },
  {
    id: '8',
    name: 'LED射灯 轨道式',
    brand: 'Track Lighting',
    category: '射灯',
    price: 69.00,
    description: '轨道式LED射灯，角度可调，适合重点照明和展示。',
    specifications: {
      wattage: 7,
      lumens: 600,
      color_temperature: '4000K',
      dimmable: false,
      smart_compatible: false
    },
    image_urls: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400'],
    affiliate_links: {
      amazon: 'https://amazon.cn/dp/example8',
      lighting_direct: 'https://lightingdirect.com/example8'
    },
    commission_rate: 8.5,
    rating: 4.3,
    review_count: 145,
    features: ['轨道安装', '角度可调', '重点照明', '展示专用'],
    created_at: '2024-01-08T00:00:00Z'
  }
];

// 根据条件过滤产品
export function filterProducts(filters: {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  style?: string;
  features?: string[];
}): LightingProduct[] {
  return mockProducts.filter(product => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    if (filters.priceMin && product.price < filters.priceMin) {
      return false;
    }
    
    if (filters.priceMax && product.price > filters.priceMax) {
      return false;
    }
    
    if (filters.features && filters.features.length > 0) {
      const hasFeature = filters.features.some(feature => 
        product.features?.includes(feature)
      );
      if (!hasFeature) return false;
    }
    
    return true;
  });
}

// 模拟推荐算法
export function getRecommendations(preferences: {
  room_type?: string;
  room_size?: string;
  style_preference?: string;
  budget_range?: string;
}): LightingProduct[] {
  let recommended = [...mockProducts];
  
  // 根据预算过滤
  if (preferences.budget_range) {
    const budget = parseBudgetRange(preferences.budget_range);
    recommended = recommended.filter(p => 
      p.price >= budget.min && p.price <= budget.max
    );
  }
  
  // 根据房间类型推荐
  if (preferences.room_type === '客厅') {
    recommended = recommended.filter(p => 
      ['吸顶灯', '吊灯', '射灯'].includes(p.category)
    );
  } else if (preferences.room_type === '卧室') {
    recommended = recommended.filter(p => 
      ['台灯', '吸顶灯', '壁灯'].includes(p.category)
    );
  }
  
  // 根据风格偏好排序
  if (preferences.style_preference === '现代简约') {
    recommended.sort((a, b) => {
      const aModern = a.features?.includes('现代设计') ? 1 : 0;
      const bModern = b.features?.includes('现代设计') ? 1 : 0;
      return bModern - aModern;
    });
  }
  
  // 按评分排序并返回前6个
  return recommended
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
}

function parseBudgetRange(range: string): { min: number; max: number } {
  switch (range) {
    case '100以下': return { min: 0, max: 100 };
    case '100-300': return { min: 100, max: 300 };
    case '300-800': return { min: 300, max: 800 };
    case '800-2000': return { min: 800, max: 2000 };
    case '2000以上': return { min: 2000, max: 99999 };
    default: return { min: 0, max: 99999 };
  }
}