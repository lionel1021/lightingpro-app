'use client';

import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Eye, TrendingUp, Award, Zap, DollarSign } from 'lucide-react';
import { LightingProduct } from '@/lib/supabase';
import { RecommendationResult } from '@/lib/recommendations';
import FavoriteButton from './FavoriteButton';

interface RecommendationCardProps {
  recommendation: RecommendationResult & {
    recommendation_score?: number;
    recommendation_confidence?: number;
    recommendation_reasons?: string[];
    recommendation_category?: string;
  };
  onView?: (productId: string) => void;
  onAddToCart?: (product: LightingProduct) => void;
  onFeedback?: (productId: string, feedbackType: string) => void;
  showDetails?: boolean;
  className?: string;
}

const categoryIcons = {
  perfect_match: Award,
  popular_choice: TrendingUp,
  budget_friendly: DollarSign,
  style_match: Heart,
  trending: Zap
};

const categoryColors = {
  perfect_match: 'bg-green-100 text-green-800 border-green-200',
  popular_choice: 'bg-blue-100 text-blue-800 border-blue-200',
  budget_friendly: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  style_match: 'bg-purple-100 text-purple-800 border-purple-200',
  trending: 'bg-orange-100 text-orange-800 border-orange-200'
};

const categoryLabels = {
  perfect_match: '完美匹配',
  popular_choice: '热门选择',
  budget_friendly: '超值推荐',
  style_match: '风格匹配',
  trending: '流行趋势'
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onView,
  onAddToCart,
  onFeedback,
  showDetails = true,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [viewStartTime] = useState(Date.now());

  const product = recommendation.product;
  const score = recommendation.recommendation_score || recommendation.score;
  const confidence = recommendation.recommendation_confidence || recommendation.confidence;
  const reasons = recommendation.recommendation_reasons || recommendation.reasons || [];
  const category = recommendation.recommendation_category || recommendation.category || 'trending';

  const handleView = () => {
    const viewDuration = Date.now() - viewStartTime;
    onView?.(product.id);
    onFeedback?.(product.id, 'view');
    
    // Track view duration if user stayed for more than 3 seconds
    if (viewDuration > 3000) {
      onFeedback?.(product.id, 'engaged_view');
    }
  };

  const handleAddToCart = () => {
    onAddToCart?.(product);
    onFeedback?.(product.id, 'cart_add');
  };

  const handleClick = () => {
    onFeedback?.(product.id, 'click');
  };

  const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || Zap;
  const categoryColor = categoryColors[category as keyof typeof categoryColors] || categoryColors.trending;
  const categoryLabel = categoryLabels[category as keyof typeof categoryLabels] || '推荐商品';

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden
        hover:shadow-lg transition-all duration-300 cursor-pointer group
        ${isHovered ? 'transform -translate-y-1' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100">
        <img 
          src={product.image_urls?.[0] || '/placeholder-product.png'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium border ${categoryColor} flex items-center gap-1`}>
          <CategoryIcon className="w-3 h-3" />
          {categoryLabel}
        </div>

        {/* Rating Badge */}
        {product.rating && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium">{product.rating}</span>
          </div>
        )}

        {/* Confidence Score */}
        {showDetails && confidence && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white rounded-full px-2 py-1">
            <span className="text-xs font-medium">{Math.round(confidence * 100)}%匹配</span>
          </div>
        )}

        {/* Favorite Button */}
        <div className="absolute bottom-3 left-3">
          <FavoriteButton
            product={product}
            variant="icon-only"
            showText={false}
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          />
        </div>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleView();
              }}
              className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              title="查看详情"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
              title="加入购物车"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
            {product.name}
          </h3>
        </div>

        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

        {/* Recommendation Reasons */}
        {showDetails && reasons.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {reasons.slice(0, 2).map((reason, index) => (
                <span 
                  key={index}
                  className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-green-600">
              ¥{product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {product.category.replace('_', ' ')}
            </span>
          </div>

          {/* Recommendation Score */}
          {showDetails && score && (
            <div className="text-right">
              <div className="text-xs text-gray-500">推荐指数</div>
              <div className="flex items-center">
                <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-2">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(score * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-blue-600">
                  {Math.round(score * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Product Features */}
        {product.features && product.features.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index}
                  className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {product.review_count && (
              <span>{product.review_count} 评价</span>
            )}
            {recommendation.priceRatio !== undefined && (
              <span>
                预算位置: {Math.round(recommendation.priceRatio * 100)}%
              </span>
            )}
          </div>
          
          {/* Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center space-x-1"
          >
            <ShoppingCart className="w-3 h-3" />
            <span>加购物车</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;