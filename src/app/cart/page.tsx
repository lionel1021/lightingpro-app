'use client'

import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  Truck, 
  Shield, 
  CreditCard,
  Star,
  Lightbulb,
  ShoppingBag
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const {
    cart,
    summary,
    isLoading,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 导航栏 */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-gray-900">LightingPro</span>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  继续购物
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* 空购物车状态 */}
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">购物车是空的</h1>
            <p className="text-gray-600">
              还没有添加任何商品，去看看我们的56款精选照明产品吧！
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/questionnaire">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Lightbulb className="w-5 h-5 mr-2" />
                开始智能推荐
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="lg">
                浏览所有产品
              </Button>
            </Link>
          </div>

          {/* 特色功能展示 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">AI智能推荐</h3>
              <p className="text-sm text-gray-600">个性化产品匹配</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">满199免运费</h3>
              <p className="text-sm text-gray-600">全国包邮到家</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">品质保障</h3>
              <p className="text-sm text-gray-600">7大知名品牌</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-gray-900">LightingPro</span>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {summary.totalItems} 件商品
              </Badge>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  继续购物
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">购物车</h1>
          <Badge className="bg-blue-600 text-white">
            {summary.totalItems} 件商品
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 购物车商品列表 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 清空购物车按钮 */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">商品清单</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearCart}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                清空购物车
              </Button>
            </div>

            {/* 商品列表 */}
            <div className="space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-6">
                    {/* 商品图片 */}
                    <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.product.image_urls && item.product.image_urls[0] ? (
                        <Image
                          src={item.product.image_urls[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl">💡</span>
                        </div>
                      )}
                    </div>

                    {/* 商品信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-sm text-blue-600 font-medium">
                            {item.product.brand?.name}
                          </div>
                          <Link 
                            href={`/products/${item.product.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* 商品特性 */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.product.features?.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* 价格和数量控制 */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-red-600">
                            ¥{item.product.price}
                          </span>
                          {item.product.original_price && item.product.original_price > item.product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ¥{item.product.original_price}
                            </span>
                          )}
                        </div>

                        {/* 数量控制 */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 小计 */}
                      <div className="mt-3 text-right">
                        <span className="text-sm text-gray-600">小计: </span>
                        <span className="text-lg font-bold text-gray-900">
                          ¥{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 订单摘要 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  订单摘要
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">商品总价</span>
                  <span className="font-medium">¥{summary.totalPrice.toFixed(2)}</span>
                </div>

                {summary.totalSavings > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>优惠金额</span>
                    <span className="font-medium">-¥{summary.totalSavings.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">运费</span>
                  <span className={`font-medium ${summary.estimatedShipping === 0 ? 'text-green-600' : ''}`}>
                    {summary.estimatedShipping === 0 ? '免运费' : `¥${summary.estimatedShipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>税费</span>
                  <span>¥{summary.estimatedTax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>总计</span>
                  <span className="text-red-600">¥{summary.finalTotal.toFixed(2)}</span>
                </div>

                {/* 免运费提示 */}
                {summary.totalPrice < 199 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Truck className="w-4 h-4" />
                      <span className="text-sm">
                        再购买 ¥{(199 - summary.totalPrice).toFixed(2)} 即可免运费
                      </span>
                    </div>
                  </div>
                )}

                {/* 结算按钮 */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                    disabled={isLoading}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    立即结算 ({summary.totalItems}件)
                  </Button>
                  
                  <Link href="/questionnaire" className="block">
                    <Button variant="outline" className="w-full" size="lg">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      获取更多推荐
                    </Button>
                  </Link>
                </div>

                {/* 安全保障 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">购物保障</span>
                  </div>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• 7天无理由退换</li>
                    <li>• 正品保证</li>
                    <li>• 全国联保</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}