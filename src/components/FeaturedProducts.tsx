'use client';

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Heart } from 'lucide-react'
import Link from 'next/link'

// 最新精选商品数据 - 2024年热门照明产品
const mockProducts = [
  {
    id: 1,
    name: 'Philips Hue Play HDMI Sync Box + 2 Bulbs',
    price: 199.99,
    rating: 4.9,
    brand: 'Philips',
    category: 'Smart Home Kit',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    description: 'Complete smart lighting kit with HDMI sync for immersive entertainment',
    features: ['Voice Control', 'App Control', 'Color Changing', 'HDMI Sync'],
    inStock: true,
    isHot: true
  },
  {
    id: 2, 
    name: 'West Elm Sculptural Glass Globe Pendant',
    price: 149.99,
    rating: 4.7,
    brand: 'West Elm',
    category: 'Pendant Lights',
    image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    description: 'Modern glass globe pendant with brass hardware for dining rooms',
    features: ['Dimmable', 'Brass Hardware', 'Glass Globe', 'Chain Adjustable'],
    inStock: true,
    isHot: true
  },
  {
    id: 3,
    name: 'Govee Immersion WiFi TV LED Strip 55-65"',
    price: 99.99,
    rating: 4.8,
    brand: 'Govee',
    category: 'Smart LED Strips',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    description: 'WiFi TV LED strip with camera for screen color matching',
    features: ['Camera Sync', 'WiFi Control', '16M Colors', 'Music Sync'],
    inStock: true,
    isHot: false
  },
  {
    id: 4,
    name: 'Article Cerno Brass Table Lamp',
    price: 279.99,
    rating: 4.6,
    brand: 'Article',
    category: 'Table Lamps',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    description: 'Mid-century modern brass table lamp with fabric shade',
    features: ['Brass Finish', 'Fabric Shade', 'Adjustable Height', 'E26 Bulb'],
    inStock: true,
    isHot: false
  }
];

const ProductCard = React.memo(({ product }: { product: typeof mockProducts[0] }) => (
  <Card className="group hover:shadow-lg transition-shadow duration-200">
    <CardContent className="p-0">
      <div className="relative">
        {/* 产品图片 */}
        <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-100 to-indigo-100">
          <img 
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // 如果图片加载失败，显示占位符
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="w-full h-full flex items-center justify-center">
                  <span class="text-4xl">💡</span>
                </div>
              `;
            }}
          />
        </div>

        {/* 特色标签 */}
        {product.isHot && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            🔥 Hot
          </Badge>
        )}
        {!product.inStock && (
          <Badge className="absolute top-2 left-2 bg-gray-500 text-white">
            Out of Stock
          </Badge>
        )}

        {/* 收藏按钮 */}
        <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        {/* 品牌 */}
        <div className="text-sm text-blue-600 font-medium mb-1">
          {product.brand}
        </div>

        {/* 产品名称 */}
        <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h4>

        {/* 评分 */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating}
            </span>
          </div>
          <span className="text-gray-400">·</span>
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>

        {/* 价格 */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
          </div>
          
          <Link href={`/products/${product.id}`}>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </CardContent>
  </Card>
))

ProductCard.displayName = 'ProductCard'

export const FeaturedProducts = React.memo(() => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
})

FeaturedProducts.displayName = 'FeaturedProducts'