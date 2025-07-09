/**
 * 🛒 购物车状态管理
 * 使用 localStorage 和 Context API 实现购物车功能
 */

import { LightingProduct } from './types'

export interface CartItem {
  id: string
  product: LightingProduct
  quantity: number
  addedAt: string
  selectedVariant?: {
    color?: string
    size?: string
    specifications?: Record<string, any>
  }
}

export interface CartSummary {
  totalItems: number
  totalPrice: number
  originalTotalPrice: number
  totalSavings: number
  estimatedShipping: number
  estimatedTax: number
  finalTotal: number
}

export class CartManager {
  private static STORAGE_KEY = 'lightingpro_cart'

  // 获取购物车数据
  static getCart(): CartItem[] {
    if (typeof window === 'undefined') return []
    
    try {
      const cartData = localStorage.getItem(this.STORAGE_KEY)
      return cartData ? JSON.parse(cartData) : []
    } catch (error) {
      console.error('获取购物车数据失败:', error)
      return []
    }
  }

  // 保存购物车数据
  static saveCart(cart: CartItem[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart))
      // 触发自定义事件，通知其他组件更新
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }))
    } catch (error) {
      console.error('保存购物车数据失败:', error)
    }
  }

  // 添加商品到购物车
  static addToCart(product: LightingProduct, quantity: number = 1): CartItem[] {
    const cart = this.getCart()
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id)

    if (existingItemIndex >= 0) {
      // 如果商品已存在，增加数量
      cart[existingItemIndex].quantity += quantity
    } else {
      // 添加新商品
      const timestamp = typeof window !== 'undefined' ? Date.now() : 0
      const newItem: CartItem = {
        id: `${product.id}-${timestamp}`,
        product,
        quantity,
        addedAt: typeof window !== 'undefined' ? new Date().toISOString() : '1970-01-01T00:00:00.000Z'
      }
      cart.push(newItem)
    }

    this.saveCart(cart)
    return cart
  }

  // 更新商品数量
  static updateQuantity(itemId: string, quantity: number): CartItem[] {
    const cart = this.getCart()
    const itemIndex = cart.findIndex(item => item.id === itemId)

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // 数量为0时移除商品
        cart.splice(itemIndex, 1)
      } else {
        cart[itemIndex].quantity = quantity
      }
    }

    this.saveCart(cart)
    return cart
  }

  // 移除商品
  static removeFromCart(itemId: string): CartItem[] {
    const cart = this.getCart()
    const updatedCart = cart.filter(item => item.id !== itemId)
    this.saveCart(updatedCart)
    return updatedCart
  }

  // 清空购物车
  static clearCart(): void {
    this.saveCart([])
  }

  // 计算购物车总价
  static calculateSummary(cart: CartItem[]): CartSummary {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    
    const totalPrice = cart.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    )
    
    const originalTotalPrice = cart.reduce((sum, item) => 
      sum + ((item.product.original_price || item.product.price) * item.quantity), 0
    )
    
    const totalSavings = originalTotalPrice - totalPrice
    
    // 运费计算（满199免运费）
    const estimatedShipping = totalPrice >= 199 ? 0 : 15
    
    // 税费计算（按总价的3%）
    const estimatedTax = totalPrice * 0.03
    
    const finalTotal = totalPrice + estimatedShipping + estimatedTax

    return {
      totalItems,
      totalPrice,
      originalTotalPrice,
      totalSavings,
      estimatedShipping,
      estimatedTax,
      finalTotal
    }
  }

  // 检查商品是否在购物车中
  static isInCart(productId: string): boolean {
    const cart = this.getCart()
    return cart.some(item => item.product.id === productId)
  }

  // 获取商品在购物车中的数量
  static getItemQuantity(productId: string): number {
    const cart = this.getCart()
    const item = cart.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }

  // 获取购物车商品总数
  static getTotalItemsCount(): number {
    const cart = this.getCart()
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  // 获取推荐的相关商品（基于购物车内容）
  static getRecommendedProducts(allProducts: LightingProduct[]): LightingProduct[] {
    const cart = this.getCart()
    if (cart.length === 0) return []

    // 获取购物车中商品的分类
    const cartCategories = [...new Set(cart.map(item => item.product.category?.name).filter(Boolean))]
    const cartBrands = [...new Set(cart.map(item => item.product.brand?.name).filter(Boolean))]
    const cartProductIds = cart.map(item => item.product.id)

    // 找到相关产品
    return allProducts
      .filter(product => 
        !cartProductIds.includes(product.id) && // 不包含已在购物车的产品
        (cartCategories.includes(product.category?.name || '') || 
         cartBrands.includes(product.brand?.name || ''))
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // 按评分排序
      .slice(0, 4) // 最多4个推荐
  }
}