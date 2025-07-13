'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { LightingProduct } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface AdvancedProductSearchProps {
  products: LightingProduct[];
  onFilteredResults: (results: LightingProduct[]) => void;
  placeholder?: string;
}

interface FilterState {
  searchQuery: string;
  category: string;
  brand: string;
  priceRange: [number, number];
  rating: number;
  sortBy: 'name' | 'price' | 'rating' | 'newest';
  sortOrder: 'asc' | 'desc';
}

export default function AdvancedProductSearch({ 
  products, 
  onFilteredResults, 
  placeholder = "搜索照明产品..." 
}: AdvancedProductSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: '',
    brand: '',
    priceRange: [0, 2000],
    rating: 0,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // 提取唯一的类别和品牌
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))].filter(Boolean);
    return cats.sort();
  }, [products]);

  const brands = useMemo(() => {
    const brandsSet = [...new Set(products.map(p => p.brand))].filter(Boolean);
    return brandsSet.sort();
  }, [products]);

  // 过滤和排序产品
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 搜索查询过滤
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    // 类别过滤
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }

    // 品牌过滤
    if (filters.brand) {
      result = result.filter(product => product.brand === filters.brand);
    }

    // 价格范围过滤
    result = result.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );

    // 评分过滤
    if (filters.rating > 0) {
      result = result.filter(product => (product.rating || 0) >= filters.rating);
    }

    // 排序
    result.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'newest':
          aValue = a.id; // 使用ID作为新旧判断
          bValue = b.id;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [products, filters]);

  // 更新过滤结果
  React.useEffect(() => {
    onFilteredResults(filteredProducts);
  }, [filteredProducts, onFilteredResults]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      category: '',
      brand: '',
      priceRange: [0, 2000],
      rating: 0,
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.brand,
    filters.rating > 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 2000
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 ${showFilters ? 'bg-blue-50 border-blue-200' : ''}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          筛选
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 bg-blue-600 text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">筛选条件</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                清除全部
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 类别筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                类别
              </label>
              <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择类别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部类别</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 品牌筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                品牌
              </label>
              <Select value={filters.brand} onValueChange={(value) => updateFilter('brand', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择品牌" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部品牌</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 价格范围 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                价格范围 (¥{filters.priceRange[0]} - ¥{filters.priceRange[1]})
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={filters.priceRange[0]}
                  onChange={(e) => updateFilter('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>

            {/* 评分筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最低评分
              </label>
              <Select value={filters.rating.toString()} onValueChange={(value) => updateFilter('rating', Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="选择评分" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">不限</SelectItem>
                  <SelectItem value="3">3星及以上</SelectItem>
                  <SelectItem value="4">4星及以上</SelectItem>
                  <SelectItem value="4.5">4.5星及以上</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 排序选项 */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">排序方式:</span>
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">名称</SelectItem>
                  <SelectItem value="price">价格</SelectItem>
                  <SelectItem value="rating">评分</SelectItem>
                  <SelectItem value="newest">最新</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.sortOrder} onValueChange={(value) => updateFilter('sortOrder', value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">升序</SelectItem>
                  <SelectItem value="desc">降序</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* 结果统计 */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>找到 {filteredProducts.length} 个产品</span>
        {filters.searchQuery && (
          <span>搜索: "{filters.searchQuery}"</span>
        )}
      </div>
    </div>
  );
}