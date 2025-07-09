'use client'

// 产品卡片骨架加载
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  )
}

// 页面加载组件
export function PageLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading amazing lighting products...</p>
      </div>
    </div>
  )
}

// 小型加载指示器
export function MiniSpinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <div className={`border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin ${className}`}></div>
  )
}

// 成功状态指示器
export function SuccessIndicator({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-green-600">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

// 错误状态指示器
export function ErrorIndicator({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-red-600">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}