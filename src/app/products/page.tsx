'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { LightingProduct } from '@/lib/types';
import { mockProducts } from '@/lib/mock-data';
import { useCart } from '@/contexts/CartContext';
import UserStatus from '@/components/UserStatus';
import AdvancedProductSearch from '@/components/AdvancedProductSearch';
import LoadingSpinner from '@/components/LoadingSpinner';
import { MobilePerformanceMonitor, TouchOptimizedButton, MobileLazyImage, useMobileOptimization } from '@/components/MobileOptimizations';

// Mobile-optimized product card component
function ProductCard({ product }: { product: LightingProduct }) {
  const { addToCart, favorites, toggleFavorite } = useCart();
  const { performanceMode } = useMobileOptimization();
  const isFavorite = favorites.has(product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-100 to-indigo-100">
            {product.image_urls && product.image_urls.length > 0 ? (
              performanceMode === 'low-power' ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                  <span className="text-4xl">💡</span>
                  <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    省电模式
                  </div>
                </div>
              ) : (
                <MobileLazyImage 
                  src={product.image_urls[0]} 
                  alt={product.name}
                  className="w-full h-full"
                  placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfkqE8L3RleHQ+PC9zdmc+"
                />
              )
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

          <TouchOptimizedButton
            onClick={handleToggleFavorite}
            variant="ghost"
            size="small"
            className={`absolute top-2 right-2 w-10 h-10 backdrop-blur-sm rounded-full ${
              isFavorite 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </TouchOptimizedButton>
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

          <div className="flex items-center justify-between mb-3">
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
              <TouchOptimizedButton
                onClick={() => {}}
                variant="ghost"
                size="small"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium p-2"
              >
                查看详情
              </TouchOptimizedButton>
            </Link>
          </div>

          <TouchOptimizedButton
            onClick={handleAddToCart}
            variant="primary"
            size="medium"
            className="w-full"
          >
            <ShoppingCart className="w-4 h-4" />
            加入购物车
          </TouchOptimizedButton>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<LightingProduct[]>(mockProducts);
  const [isLoading, setIsLoading] = useState(true);
  const { totalItems } = useCart();

  useEffect(() => {
    setMounted(true);
    // 模拟加载时间
    setTimeout(() => setIsLoading(false), 800);
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
      {/* Mobile Performance Monitor */}
      <MobilePerformanceMonitor />
      
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
              
              {/* 搜索和筛选 */}
              <div className="mt-6">
                <AdvancedProductSearch 
                  products={mockProducts}
                  onFilteredResults={setFilteredProducts}
                  placeholder="搜索照明产品、品牌或类别..."
                />
              </div>
            </div>
            
            {/* User Status and Cart */}
            <div className="flex items-center space-x-4">
              <UserStatus />
              <div className="relative">
                <Link href="/cart">
                  <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <ShoppingCart className="w-6 h-6" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner size="lg" text="加载产品中..." variant="branded" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">未找到相关产品</h3>
            <p className="text-gray-600 mb-6">
              请尝试调整搜索条件或筛选选项
            </p>
            <Link href="/questionnaire">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                获取AI推荐
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* 产品统计和视图选项 */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                显示 {filteredProducts.length} 个产品，共 {mockProducts.length} 个
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">视图:</span>
                <button className="p-2 bg-blue-600 text-white rounded">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 产品网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* 加载更多按钮 */}
            {filteredProducts.length >= 12 && (
              <div className="text-center mt-12">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg transition-colors">
                  加载更多产品
                </button>
              </div>
            )}
          </>
        )}
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