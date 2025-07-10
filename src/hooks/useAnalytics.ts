'use client'

import { useState, useEffect, useCallback } from 'react'
import { userAnalytics, AnalyticsReport } from '@/lib/analytics'

export interface AnalyticsFilters {
  dateRange: string
  metricType: string
  refreshInterval?: number
}

export interface AnalyticsState {
  report: AnalyticsReport | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

export const useAnalytics = (initialFilters: AnalyticsFilters) => {
  const [state, setState] = useState<AnalyticsState>({
    report: null,
    loading: true,
    error: null,
    lastUpdated: null
  })

  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters)

  const fetchAnalytics = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const report = await userAnalytics.generateReport({
        dateRange: filters.dateRange,
        includeRealtime: true,
        includeConversion: true,
        includeGeography: true,
        includeBehavior: true
      })

      setState({
        report,
        loading: false,
        error: null,
        lastUpdated: new Date()
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }))
    }
  }, [filters])

  const refreshAnalytics = useCallback(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const updateFilters = useCallback((newFilters: Partial<AnalyticsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Auto-refresh if interval is set
  useEffect(() => {
    if (filters.refreshInterval && filters.refreshInterval > 0) {
      const interval = setInterval(fetchAnalytics, filters.refreshInterval)
      return () => clearInterval(interval)
    }
  }, [filters.refreshInterval, fetchAnalytics])

  return {
    ...state,
    filters,
    updateFilters,
    refreshAnalytics,
    isStale: state.lastUpdated ? Date.now() - state.lastUpdated.getTime() > 300000 : false // 5 minutes
  }
}