'use client';

/**
 * 📊 数据分析仪表板 - 管理员数据洞察中心
 */

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Eye,
  MousePointer,
  Heart,
  BarChart3,
  RefreshCw,
  Download
} from 'lucide-react';

interface DashboardData {
  overview: {
    totalUsers: number;
    totalProducts: number;
    totalRecommendations: number;
    averageRating: number;
  };
  analytics: {
    users: {
      newUsers: number;
      activeUsers: number;
      totalPageViews: number;
      completedQuestionnaires: number;
      conversionRate: number;
    };
    products: {
      totalViews: number;
      totalClicks: number;
      totalFavorites: number;
      clickThroughRate: number;
      favoriteRate: number;
    };
    revenue: {
      totalAffiliateClicks: number;
      totalEstimatedRevenue: number;
      avgConversionRate: number;
    };
    behavior: {
      byType: Record<string, number>;
      bySource: Record<string, number>;
      byPlatform: Record<string, number>;
    };
  };
  insights: {
    topProducts: Array<{
      id: string;
      name: string;
      brand: string;
      price: number;
      image: string;
      metrics: {
        views: number;
        clicks: number;
        favorites: number;
        purchases: number;
      };
    }>;
    dailyTrends: Array<{
      date: string;
      newUsers: number;
      activeUsers: number;
      productViews: number;
      productClicks: number;
      revenue: number;
    }>;
  };
  metadata: {
    timeRange: string;
    updatedAt: string;
    dataFreshness: string;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || '获取数据失败');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, fetchAnalytics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">加载分析数据...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button 
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">数据分析仪表板</h1>
              <p className="mt-1 text-sm text-gray-500">
                实时业务数据洞察 · 最后更新: {new Date(data.metadata.updatedAt).toLocaleString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 时间范围选择器 */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">过去7天</option>
                <option value="30d">过去30天</option>
                <option value="90d">过去90天</option>
                <option value="1y">过去1年</option>
              </select>
              
              <button
                onClick={fetchAnalytics}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </button>
              
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                导出报告
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="总用户数"
            value={data.overview.totalUsers}
            icon={<Users className="h-6 w-6" />}
            trend="+12%"
            trendUp={true}
            color="blue"
          />
          <MetricCard
            title="产品总数"
            value={data.overview.totalProducts}
            icon={<ShoppingBag className="h-6 w-6" />}
            trend="+8%"
            trendUp={true}
            color="green"
          />
          <MetricCard
            title="推荐总数"
            value={data.overview.totalRecommendations}
            icon={<TrendingUp className="h-6 w-6" />}
            trend="+23%"
            trendUp={true}
            color="purple"
          />
          <MetricCard
            title="平均评分"
            value={data.overview.averageRating}
            icon={<BarChart3 className="h-6 w-6" />}
            trend="+0.2"
            trendUp={true}
            color="orange"
            isDecimal={true}
          />
        </div>

        {/* 主要指标 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 用户分析 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">用户分析</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.analytics.users.newUsers}</div>
                <div className="text-sm text-gray-600">新用户</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.analytics.users.activeUsers}</div>
                <div className="text-sm text-gray-600">活跃用户</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{data.analytics.users.totalPageViews}</div>
                <div className="text-sm text-gray-600">页面浏览</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{data.analytics.users.completedQuestionnaires}</div>
                <div className="text-sm text-gray-600">完成问卷</div>
              </div>
            </div>
          </div>

          {/* 产品表现 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">产品表现</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">总浏览量</span>
                </div>
                <span className="text-lg font-semibold">{data.analytics.products.totalViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MousePointer className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">总点击量</span>
                </div>
                <span className="text-lg font-semibold">{data.analytics.products.totalClicks.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-gray-600">收藏总数</span>
                </div>
                <span className="text-lg font-semibold">{data.analytics.products.totalFavorites.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-600">点击率</span>
                </div>
                <span className="text-lg font-semibold">{data.analytics.products.clickThroughRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 收入分析 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">收入分析</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                ¥{data.analytics.revenue.totalEstimatedRevenue.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">预估收入</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <MousePointer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {data.analytics.revenue.totalAffiliateClicks}
              </div>
              <div className="text-sm text-gray-600">联盟点击</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {data.analytics.revenue.avgConversionRate.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">平均转化率</div>
            </div>
          </div>
        </div>

        {/* 热门产品 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">热门产品排行</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">产品</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">品牌</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">价格</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">浏览</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">点击</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">收藏</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">购买</th>
                </tr>
              </thead>
              <tbody>
                {data.insights.topProducts.slice(0, 8).map((product, index) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-blue-600 mr-2">#{index + 1}</div>
                        <Image 
                          src={product.image || '/placeholder.jpg'} 
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover mr-3"
                        />
                        <div className="text-sm font-medium text-gray-900 truncate max-w-48">
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{product.brand}</td>
                    <td className="px-4 py-3 text-sm font-medium">¥{product.price}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.metrics.views}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.metrics.clicks}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.metrics.favorites}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.metrics.purchases}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// 指标卡片组件
interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
  color: 'blue' | 'green' | 'purple' | 'orange';
  isDecimal?: boolean;
}

function MetricCard({ title, value, icon, trend, trendUp, color, isDecimal = false }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-50',
    green: 'bg-green-500 text-green-50',
    purple: 'bg-purple-500 text-purple-50',
    orange: 'bg-orange-500 text-orange-50'
  };

  const trendClasses = trendUp ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {isDecimal ? value.toFixed(1) : value.toLocaleString()}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trendClasses}`}>
          {trendUp ? '↗' : '↘'} {trend}
        </span>
        <span className="ml-2 text-xs text-gray-500">较上期</span>
      </div>
    </div>
  );
}