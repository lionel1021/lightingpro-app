'use client'

import FavoritesList from '@/components/FavoritesList'
import { LightingProduct } from '@/lib/types'

export default function FavoritesPage() {
  const handleProductSelect = (product: LightingProduct) => {
    // Navigate to product detail page
    window.location.href = `/products/${product.id}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">我的收藏</h1>
                <p className="mt-2 text-gray-600">
                  管理您喜欢的照明产品，随时查看和购买
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                <a
                  href="/search"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  继续浏览
                </a>
                <a
                  href="/"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  返回首页
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorites List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FavoritesList
          onProductSelect={handleProductSelect}
          className="shadow-sm"
        />
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>收藏您喜欢的照明产品，打造完美的家居照明方案</p>
            <div className="mt-4 space-x-4">
              <a
                href="/recommendations"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                获取个性化推荐
              </a>
              <span className="text-gray-400">|</span>
              <a
                href="/search"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                浏览更多产品
              </a>
              <span className="text-gray-400">|</span>
              <a
                href="/contact"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                联系客服
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}