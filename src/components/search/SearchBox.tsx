'use client'

import React from 'react'
import { Search, X } from 'lucide-react'

interface SearchBoxProps {
  query: string
  onQueryChange: (query: string) => void
  onClear: () => void
  placeholder?: string
  loading?: boolean
  className?: string
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  query,
  onQueryChange,
  onClear,
  placeholder = "搜索产品...",
  loading = false,
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        {query && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  )
}