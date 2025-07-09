'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductSearch } from "@/components/ProductSearch";
import { LightingProduct } from "@/lib/types";

export default function SearchPage() {
  const handleProductSelect = (product: LightingProduct) => {
    // 导航到产品详情页
    window.location.href = `/products/${product.id}`;
  };

  const handleAddToCart = (product: LightingProduct) => {
    // 添加到购物车逻辑
    console.log('Adding to cart:', product);
    // 这里可以集成购物车功能
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回首页</span>
            </Link>
            <div className="ml-8">
              <h1 className="text-2xl font-bold text-gray-900">产品搜索</h1>
              <p className="text-sm text-gray-600">浏览56+精选照明产品</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductSearch
          onProductSelect={handleProductSelect}
          onAddToCart={handleAddToCart}
          showFilters={true}
          className="rounded-lg shadow-sm border border-gray-200"
        />
      </div>
    </div>
  );
}