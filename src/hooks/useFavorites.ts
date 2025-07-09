'use client'

import { useState, useEffect, useCallback } from 'react'
import { LightingProduct } from '@/lib/types'

interface FavoriteItem {
  id: string
  product: LightingProduct
  addedAt: string
}

interface UseFavoritesReturn {
  favorites: FavoriteItem[]
  loading: boolean
  error: string | null
  isFavorited: (productId: string) => boolean
  addToFavorites: (product: LightingProduct) => Promise<boolean>
  removeFromFavorites: (productId: string) => Promise<boolean>
  toggleFavorite: (product: LightingProduct) => Promise<boolean>
  clearAllFavorites: () => Promise<boolean>
  getFavoriteCount: () => number
}

// Local storage key
const FAVORITES_STORAGE_KEY = 'lighting-app-favorites'

// Hook for managing user favorites
export const useFavorites = (userId?: string): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    setMounted(true)
    loadFavoritesFromStorage()
  }, [])

  // Load favorites from localStorage
  const loadFavoritesFromStorage = useCallback(() => {
    try {
      setLoading(true)
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (stored) {
        const parsedFavorites = JSON.parse(stored)
        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : [])
      }
      setError(null)
    } catch (err) {
      console.error('Failed to load favorites from storage:', err)
      setError('Failed to load favorites')
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Save favorites to localStorage
  const saveFavoritesToStorage = useCallback((newFavorites: FavoriteItem[]) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites))
      setFavorites(newFavorites)
      return true
    } catch (err) {
      console.error('Failed to save favorites to storage:', err)
      setError('Failed to save favorites')
      return false
    }
  }, [])

  // Check if a product is favorited
  const isFavorited = useCallback((productId: string): boolean => {
    if (!mounted) return false
    return favorites.some(fav => fav.product.id === productId)
  }, [mounted, favorites])

  // Add product to favorites
  const addToFavorites = useCallback(async (product: LightingProduct): Promise<boolean> => {
    try {
      setError(null)
      
      // Check if already favorited
      if (isFavorited(product.id)) {
        return true
      }

      const newFavorite: FavoriteItem = {
        id: `fav_${product.id}_${typeof window !== 'undefined' ? Date.now() : 0}`,
        product,
        addedAt: typeof window !== 'undefined' ? new Date().toISOString() : '1970-01-01T00:00:00.000Z'
      }

      const newFavorites = [...favorites, newFavorite]
      
      // If user is logged in, sync with backend
      if (userId) {
        try {
          const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              product_id: product.id,
              action: 'add'
            })
          })

          if (!response.ok) {
            throw new Error('Failed to sync with server')
          }
        } catch (syncError) {
          console.warn('Failed to sync favorite with server:', syncError)
          // Continue with local storage even if sync fails
        }
      }

      return saveFavoritesToStorage(newFavorites)
    } catch (err) {
      console.error('Failed to add to favorites:', err)
      setError('Failed to add to favorites')
      return false
    }
  }, [favorites, isFavorited, saveFavoritesToStorage, userId])

  // Remove product from favorites
  const removeFromFavorites = useCallback(async (productId: string): Promise<boolean> => {
    try {
      setError(null)
      
      const newFavorites = favorites.filter(fav => fav.product.id !== productId)
      
      // If user is logged in, sync with backend
      if (userId) {
        try {
          const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              product_id: productId,
              action: 'remove'
            })
          })

          if (!response.ok) {
            throw new Error('Failed to sync with server')
          }
        } catch (syncError) {
          console.warn('Failed to sync favorite removal with server:', syncError)
          // Continue with local storage even if sync fails
        }
      }

      return saveFavoritesToStorage(newFavorites)
    } catch (err) {
      console.error('Failed to remove from favorites:', err)
      setError('Failed to remove from favorites')
      return false
    }
  }, [favorites, saveFavoritesToStorage, userId])

  // Toggle favorite status
  const toggleFavorite = useCallback(async (product: LightingProduct): Promise<boolean> => {
    if (isFavorited(product.id)) {
      return await removeFromFavorites(product.id)
    } else {
      return await addToFavorites(product)
    }
  }, [isFavorited, addToFavorites, removeFromFavorites])

  // Clear all favorites
  const clearAllFavorites = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      
      // If user is logged in, sync with backend
      if (userId) {
        try {
          const response = await fetch('/api/favorites', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId
            })
          })

          if (!response.ok) {
            throw new Error('Failed to sync with server')
          }
        } catch (syncError) {
          console.warn('Failed to sync clear favorites with server:', syncError)
          // Continue with local storage even if sync fails
        }
      }

      return saveFavoritesToStorage([])
    } catch (err) {
      console.error('Failed to clear favorites:', err)
      setError('Failed to clear favorites')
      return false
    }
  }, [saveFavoritesToStorage, userId])

  // Get favorites count
  const getFavoriteCount = useCallback((): number => {
    return favorites.length
  }, [favorites])

  // Sync with server when user logs in
  useEffect(() => {
    if (userId && favorites.length > 0) {
      // Optionally sync local favorites with server
      const syncWithServer = async () => {
        try {
          const response = await fetch('/api/favorites/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              local_favorites: favorites.map(fav => ({
                product_id: fav.product.id,
                added_at: fav.addedAt
              }))
            })
          })

          if (response.ok) {
            const { data } = await response.json()
            if (data?.favorites) {
              // Update local storage with server data if needed
              saveFavoritesToStorage(data.favorites)
            }
          }
        } catch (err) {
          console.warn('Failed to sync favorites with server:', err)
        }
      }

      syncWithServer()
    }
  }, [userId, favorites, saveFavoritesToStorage])

  return {
    favorites,
    loading,
    error,
    isFavorited,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearAllFavorites,
    getFavoriteCount
  }
}

export default useFavorites