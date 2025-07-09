'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { ProductCardSkeleton, PageLoadingSpinner } from './LoadingStates'

// 懒加载的产品搜索组件
export const LazyProductSearch = dynamic(
  () => import('./ProductSearch').then(mod => ({ default: mod.ProductSearch })),
  {
    loading: () => <ProductCardSkeleton />,
    ssr: false
  }
)

// 懒加载的精选产品组件
export const LazyFeaturedProducts = dynamic(
  () => import('./FeaturedProducts').then(mod => ({ default: mod.FeaturedProducts })),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    ),
    ssr: true // 保持 SSR 以利于 SEO
  }
)

// 懒加载的购物车图标
export const LazyCartIcon = dynamic(
  () => import('./CartIcon').then(mod => ({ default: mod.CartIcon })),
  {
    loading: () => <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>,
    ssr: false
  }
)

// 懒加载的认证状态组件
export const LazyAuthStatus = dynamic(
  () => import('./AuthStatus').then(mod => ({ default: mod.AuthStatus })),
  {
    loading: () => <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>,
    ssr: false
  }
)

// 懒加载的图片上传组件
export const LazyImageUpload = dynamic(
  () => import('./ImageUpload').then(mod => ({ default: mod.ImageUpload })),
  {
    loading: () => (
      <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading upload...</div>
      </div>
    ),
    ssr: false
  }
)

// 懒加载的收藏按钮
export const LazyFavoriteButton = dynamic(
  () => import('./FavoriteButton').then(mod => ({ default: mod.FavoriteButton })),
  {
    loading: () => <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>,
    ssr: false
  }
)

// 通用的懒加载包装器
interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  delay?: number
}

export function LazyWrapper({ children, fallback, delay = 0 }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <PageLoadingSpinner />}>
      {delay > 0 ? (
        <DelayedRenderer delay={delay}>
          {children}
        </DelayedRenderer>
      ) : (
        children
      )}
    </Suspense>
  )
}

// 延迟渲染组件
function DelayedRenderer({ children, delay }: { children: React.ReactNode; delay: number }) {
  const [shouldRender, setShouldRender] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return shouldRender ? <>{children}</> : null
}