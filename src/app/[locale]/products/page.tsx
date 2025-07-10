'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { LightingProduct } from '@/lib/types';
import { mockProducts } from '@/lib/mock-data';

// Simple product card component
function ProductCard({ product }: { product: LightingProduct }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-100 to-indigo-100">
            {product.image_urls && product.image_urls.length > 0 ? (
              <img 
                src={product.image_urls[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl">💡</span>
              </div>
            )}
          </div>

          {product.rating && product.rating >= 4.5 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              🔥 Hot
            </Badge>
          )}

          <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          <div className="text-sm text-blue-600 font-medium mb-1">
            {product.brand}
          </div>

          <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h4>

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

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                ¥{product.price.toFixed(2)}
              </span>
              {product.specifications?.wattage && (
                <span className="text-xs text-gray-500">
                  {product.specifications.wattage}W
                </span>
              )}
            </div>
            
            <Link href={`/products/${product.id}`}>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                查看详情
              </button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 避免hydration不匹配，在服务器端和客户端都显示相同内容
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <Link 
                  href="/" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>返回首页</span>
                </Link>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  💡 所有照明产品
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  浏览我们精选的照明产品，从LED灯泡到智能照明系统
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 rounded-lg h-64 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Page Bottom Info */}
        <div className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Smart Search
                </h3>
                <p className="text-gray-600">
                  Powerful search and filtering features to help you find the perfect lighting
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quality Assured
                </h3>
                <p className="text-gray-600">
                  All products are carefully curated for quality and performance
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Expert Recommendations
                </h3>
                <p className="text-gray-600">
                  AI-powered recommendations based on user reviews and expert testing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>返回首页</span>
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                💡 所有照明产品
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                浏览我们精选的{mockProducts.length}款优质照明产品，从LED灯泡到智能照明系统
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Page Bottom Info */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Search
              </h3>
              <p className="text-gray-600">
                Powerful search and filtering features to help you find the perfect lighting
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quality Assured
              </h3>
              <p className="text-gray-600">
                All products are carefully curated for quality and performance
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Expert Recommendations
              </h3>
              <p className="text-gray-600">
                AI-powered recommendations based on user reviews and expert testing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}