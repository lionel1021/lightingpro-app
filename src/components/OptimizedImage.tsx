'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackIcon?: string
  priority?: boolean
}

export function OptimizedImage({ 
  src, 
  alt, 
  width = 400, 
  height = 400, 
  className = '',
  fallbackIcon = '💡',
  priority = false 
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 ${className}`}>
        <span className="text-4xl">{fallbackIcon}</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-bounce"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
        priority={priority}
      />
    </div>
  )
}