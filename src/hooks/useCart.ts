'use client'

import { useState, useEffect } from 'react'
import { CartItem, CartSummary, CartManager } from '@/lib/cart'
import { LightingProduct } from '@/lib/types'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [summary, setSummary] = useState<CartSummary>({
    totalItems: 0,
    totalPrice: 0,
    originalTotalPrice: 0,
    totalSavings: 0,
    estimatedShipping: 0,
    estimatedTax: 0,
    finalTotal: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 客户端挂载后才初始化购物车数据
  useEffect(() => {
    setMounted(true)
    const initialCart = CartManager.getCart()
    setCart(initialCart)
    setSummary(CartManager.calculateSummary(initialCart))
  }, [])

  // 监听购物车更新事件
  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent<CartItem[]>) => {
      const updatedCart = event.detail
      setCart(updatedCart)
      setSummary(CartManager.calculateSummary(updatedCart))
    }

    window.addEventListener('cart-updated', handleCartUpdate as EventListener)
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate as EventListener)
    }
  }, [])

  // 添加商品到购物车
  const addToCart = async (product: LightingProduct, quantity: number = 1) => {
    setIsLoading(true)
    try {
      const updatedCart = CartManager.addToCart(product, quantity)
      setCart(updatedCart)
      setSummary(CartManager.calculateSummary(updatedCart))
      
      // 显示成功提示
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: {
            type: 'success',
            message: `${product.name} 已添加到购物车`
          }
        }))
      }
    } catch (error) {
      console.error('添加到购物车失败:', error)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: {
            type: 'error',
            message: '添加到购物车失败，请重试'
          }
        }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 更新商品数量
  const updateQuantity = (itemId: string, quantity: number) => {
    const updatedCart = CartManager.updateQuantity(itemId, quantity)
    setCart(updatedCart)
    setSummary(CartManager.calculateSummary(updatedCart))
  }

  // 移除商品
  const removeFromCart = (itemId: string) => {
    const updatedCart = CartManager.removeFromCart(itemId)
    setCart(updatedCart)
    setSummary(CartManager.calculateSummary(updatedCart))
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          type: 'info',
          message: '商品已从购物车移除'
        }
      }))
    }
  }

  // 清空购物车
  const clearCart = () => {
    CartManager.clearCart()
    setCart([])
    setSummary(CartManager.calculateSummary([]))
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          type: 'info',
          message: '购物车已清空'
        }
      }))
    }
  }

  // 检查商品是否在购物车中
  const isInCart = (productId: string): boolean => {
    if (!mounted) return false
    return CartManager.isInCart(productId)
  }

  // 获取商品在购物车中的数量
  const getItemQuantity = (productId: string): number => {
    if (!mounted) return 0
    return CartManager.getItemQuantity(productId)
  }

  // 获取购物车总商品数
  const getTotalItemsCount = (): number => {
    return summary.totalItems
  }

  return {
    cart,
    summary,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getItemQuantity,
    getTotalItemsCount
  }
}