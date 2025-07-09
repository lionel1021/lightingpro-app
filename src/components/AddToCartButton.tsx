'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react'
import { LightingProduct } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AddToCartButtonProps {
  product: LightingProduct
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'lg' | 'default'
  showQuantitySelector?: boolean
}

export function AddToCartButton({ 
  product, 
  className, 
  variant = 'default',
  size = 'lg',
  showQuantitySelector = false 
}: AddToCartButtonProps) {
  const { addToCart, isInCart, getItemQuantity, updateQuantity, isLoading } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const inCart = mounted ? isInCart(product.id) : false
  const currentQuantity = mounted ? getItemQuantity(product.id) : 0

  const handleAddToCart = async () => {
    if (!product.is_available || !product.stock_quantity || product.stock_quantity <= 0) {
      return
    }

    try {
      await addToCart(product, quantity)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    } catch (error) {
      console.error('添加到购物车失败:', error)
    }
  }

  if (!product.is_available || !product.stock_quantity || product.stock_quantity <= 0) {
    return (
      <Button 
        disabled 
        variant="outline" 
        size={size}
        className={cn('cursor-not-allowed', className)}
      >
        暂时缺货
      </Button>
    )
  }

  if (justAdded) {
    return (
      <Button 
        disabled
        variant="outline"
        size={size}
        className={cn('text-green-600 border-green-600', className)}
      >
        <Check className="w-5 h-5 mr-2" />
        已添加到购物车
      </Button>
    )
  }

  if (inCart && showQuantitySelector) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // 这里应该从购物车中找到对应的item ID来更新数量
            // 暂时简化处理
            if (currentQuantity > 1) {
              // updateQuantity(itemId, currentQuantity - 1)
            }
          }}
          disabled={currentQuantity <= 1}
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <span className="px-4 py-2 border rounded text-center min-w-[60px]">
          {currentQuantity}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // updateQuantity(itemId, currentQuantity + 1)
          }}
          disabled={currentQuantity >= 10}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button 
      onClick={handleAddToCart}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={cn(
        'transition-all duration-200',
        inCart 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white',
        className
      )}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      {isLoading 
        ? '添加中...' 
        : inCart 
          ? `再次购买 (购物车中${currentQuantity}件)` 
          : `加入购物车${quantity > 1 ? ` (${quantity}件)` : ''}`
      }
    </Button>
  )
}

// 简化版本，用于产品列表
export function QuickAddToCartButton({ 
  product, 
  className 
}: { 
  product: LightingProduct
  className?: string 
}) {
  return (
    <AddToCartButton 
      product={product}
      variant="outline"
      size="sm"
      className={cn('w-full', className)}
    />
  )
}