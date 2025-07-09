'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export function CartIcon() {
  const { getTotalItemsCount } = useCart()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const itemCount = mounted ? getTotalItemsCount() : 0

  return (
    <Link href="/cart" className="relative">
      <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <div className="relative">
          <ShoppingCart className="w-6 h-6 text-gray-600" />
          {itemCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0 min-w-0"
            >
              {itemCount > 99 ? '99+' : itemCount}
            </Badge>
          )}
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-600">
          Cart
        </span>
      </div>
    </Link>
  )
}