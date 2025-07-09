'use client'

import React, { useState, useEffect } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { LightingProduct } from '@/lib/types'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  product: LightingProduct
  variant?: 'default' | 'small' | 'large' | 'icon-only'
  showText?: boolean
  className?: string
  userId?: string
  onToggle?: (isFavorited: boolean) => void
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  product,
  variant = 'default',
  showText = true,
  className = '',
  userId,
  onToggle
}) => {
  const { isFavorited, toggleFavorite } = useFavorites(userId)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const favorited = mounted ? isFavorited(product.id) : false

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      const success = await toggleFavorite(product)
      if (success) {
        onToggle?.(!favorited)
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Size and style variants
  const variants = {
    small: {
      button: 'p-1.5',
      icon: 'w-3 h-3',
      text: 'text-xs'
    },
    default: {
      button: 'p-2',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    large: {
      button: 'p-3',
      icon: 'w-5 h-5',
      text: 'text-base'
    },
    'icon-only': {
      button: 'p-2',
      icon: 'w-4 h-4',
      text: 'text-sm'
    }
  }

  const variantStyles = variants[variant]

  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          'relative rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50',
          favorited 
            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
            : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500',
          variantStyles.button,
          className
        )}
        title={favorited ? '取消收藏' : '添加到收藏'}
      >
        {isLoading ? (
          <Loader2 className={cn('animate-spin', variantStyles.icon)} />
        ) : (
          <Heart 
            className={cn(
              'transition-all duration-200',
              favorited ? 'fill-current' : '',
              variantStyles.icon
            )} 
          />
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        'inline-flex items-center space-x-2 rounded-lg border transition-all duration-200',
        'hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed',
        favorited
          ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
          : 'border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:text-red-600',
        variantStyles.button,
        className
      )}
    >
      {isLoading ? (
        <Loader2 className={cn('animate-spin', variantStyles.icon)} />
      ) : (
        <Heart 
          className={cn(
            'transition-all duration-200',
            favorited ? 'fill-current text-red-600' : '',
            variantStyles.icon
          )} 
        />
      )}
      
      {showText && (
        <span className={cn('font-medium', variantStyles.text)}>
          {favorited ? '已收藏' : '收藏'}
        </span>
      )}
    </button>
  )
}

export default FavoriteButton