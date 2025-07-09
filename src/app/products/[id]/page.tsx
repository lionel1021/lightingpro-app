import { SmartProductDatabase } from '@/lib/database-integration'
import { getFeaturedProduct, getAllFeaturedProducts } from '@/lib/featured-products-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Heart, Share2, ShoppingCart, Lightbulb, ArrowLeft, ExternalLink } from 'lucide-react'
import { AddToCartButton } from '@/components/AddToCartButton'
import { CartIcon } from '@/components/CartIcon'
import ClientOnly from '@/components/ClientOnly'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  let product
  
  // First try to get featured product data
  product = getFeaturedProduct(id)
  
  // If not found in featured products, skip database for now to avoid errors
  // Database integration will be fixed separately
  if (!product) {
    console.log('产品ID不在精选产品中:', id)
  }
  
  // If still no product found, show 404
  if (!product) {
    notFound()
  }

  // 获取相关推荐产品 - 使用精选产品作为相关产品
  let relatedProducts = []
  // Skip database query for now, use featured products as related products
  relatedProducts = getAllFeaturedProducts()
    .filter(p => p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-gray-900">LightingPro</span>
            </Link>
            <div className="flex items-center gap-3">
              <ClientOnly fallback={<div className="w-16 h-10 bg-gray-200 rounded animate-pulse" />}>
                <CartIcon />
              </ClientOnly>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.category?.name}</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 产品图片区域 */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-white border">
              {product.image_urls && product.image_urls[0] ? (
                <Image
                  src={product.image_urls[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                  <span className="text-8xl">💡</span>
                </div>
              )}
              
              {/* 特色标签 */}
              {product.is_featured && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  🔥 Hot Product
                </Badge>
              )}
            </div>

            {/* 缩略图（如果有多张图片） */}
            {product.image_urls && product.image_urls.length > 1 && (
              <div className="flex gap-2">
                {product.image_urls.slice(0, 4).map((url, index) => (
                  <div key={index} className="w-20 h-20 relative rounded border overflow-hidden">
                    <Image
                      src={url}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 产品信息区域 */}
          <div className="space-y-6">
            {/* 品牌 */}
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.brand?.name || 'Premium Brand'}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
            </div>

            {/* 评分和评价 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 4.5)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-lg">
                  {product.rating?.toFixed(1) || '4.5'}
                </span>
              </div>
              <span className="text-gray-600">
                ({product.review_count || 89} reviews)
              </span>
            </div>

            {/* 价格 */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-red-600">
                  ${product.price}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.original_price}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                Tax included, free shipping
              </div>
            </div>

            {/* 产品特性 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Product Features</h3>
              <div className="flex flex-wrap gap-2">
                {product.features?.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 库存状态 */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                product.stock_quantity && product.stock_quantity > 0 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {product.stock_quantity && product.stock_quantity > 0 
                  ? `In Stock (${product.stock_quantity} units)` 
                  : 'Out of Stock'}
              </span>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <ClientOnly fallback={<div className="flex-1 h-12 bg-gray-200 rounded animate-pulse" />}>
                  <AddToCartButton product={product} className="flex-1" />
                </ClientOnly>
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* 购买链接 */}
              {product.affiliate_links && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Purchase Options</h4>
                  <div className="space-y-2">
                    {Object.entries(product.affiliate_links as any).map(([platform, link]: [string, any]) => (
                      <a
                        key={platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <ExternalLink className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium capitalize">{platform}</div>
                            <div className="text-sm text-gray-600">
                              Commission: {((link.commission_rate || 0) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Buy Now
                        </Button>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 产品详细信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* 产品描述 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description || 
                      `${product.name} is a premium lighting product from ${product.brand?.name}. Features advanced LED technology with ${product.features?.slice(0, 3).join(', ')} and more. Perfect for ${product.category?.name} applications, providing comfortable and efficient lighting experience.`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 产品规格 */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.specifications && Object.entries(product.specifications as any).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 text-sm">{key}</span>
                      <span className="font-medium text-sm">{String(value)}</span>
                    </div>
                  ))}
                  
                  {/* 基本信息 */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Brand</span>
                    <span className="font-medium text-sm">{product.brand?.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Category</span>
                    <span className="font-medium text-sm">{product.category?.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Currency</span>
                    <span className="font-medium text-sm">{product.currency || 'USD'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 相关推荐 */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
                      {relatedProduct.image_urls && relatedProduct.image_urls[0] ? (
                        <Image
                          src={relatedProduct.image_urls[0]}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                          <span className="text-4xl">💡</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-blue-600 font-medium mb-1">
                        {relatedProduct.brand?.name}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {relatedProduct.rating?.toFixed(1) || '4.5'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-red-600">
                          ${relatedProduct.price}
                        </span>
                        <Link href={`/products/${relatedProduct.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}