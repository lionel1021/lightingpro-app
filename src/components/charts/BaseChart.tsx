'use client'

import React from 'react'
import { ResponsiveContainer } from 'recharts'

interface BaseChartProps {
  children: React.ReactNode
  height?: number
  loading?: boolean
}

export const BaseChart: React.FC<BaseChartProps> = ({ 
  children, 
  height = 300, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div 
        className="w-full bg-gray-100 rounded-lg animate-pulse flex items-center justify-center"
        style={{ height }}
      >
        <span className="text-gray-500">Loading chart...</span>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      {children}
    </ResponsiveContainer>
  )
}

export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']