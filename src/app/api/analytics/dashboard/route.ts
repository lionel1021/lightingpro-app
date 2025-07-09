/**
 * 📊 数据分析仪表板API - 管理员数据洞察
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createCachedResponse } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d'; // 7d, 30d, 90d, 1y
    const supabase = createServerSupabaseClient();

    // 计算时间范围
    const timeRanges = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const days = timeRanges[timeRange as keyof typeof timeRanges] || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // 并行获取所有数据
    const [
      overviewStats,
      userAnalytics,
      productMetrics,
      revenueData,
      topProducts,
      userBehavior,
      dailyTrends
    ] = await Promise.all([
      getOverviewStats(supabase),
      getUserAnalytics(supabase, startDate),
      getProductMetrics(supabase, startDate),
      getRevenueData(supabase, startDate),
      getTopProducts(supabase, startDate),
      getUserBehavior(supabase, startDate),
      getDailyTrends(supabase, startDate)
    ]);

    const dashboardData = {
      overview: overviewStats,
      analytics: {
        users: userAnalytics,
        products: productMetrics,
        revenue: revenueData,
        behavior: userBehavior
      },
      insights: {
        topProducts,
        dailyTrends
      },
      metadata: {
        timeRange,
        updatedAt: new Date().toISOString(),
        dataFreshness: 'real-time'
      }
    };

    return createCachedResponse({
      success: true,
      data: dashboardData
    }, 'realtime');

  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics data',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}

// 获取总览统计
async function getOverviewStats(supabase: any) {
  const [
    { count: totalUsers },
    { count: totalProducts },
    { count: totalRecommendations },
    { data: avgRating }
  ] = await Promise.all([
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('lighting_products').select('*', { count: 'exact', head: true }),
    supabase.from('recommendations').select('*', { count: 'exact', head: true }),
    supabase.from('lighting_products').select('rating').eq('status', 'active')
  ]);

  const averageRating = avgRating && avgRating.length > 0
    ? avgRating.reduce((sum: number, item: any) => sum + item.rating, 0) / avgRating.length
    : 0;

  return {
    totalUsers: totalUsers || 0,
    totalProducts: totalProducts || 0,
    totalRecommendations: totalRecommendations || 0,
    averageRating: Math.round(averageRating * 10) / 10
  };
}

// 获取用户分析数据
async function getUserAnalytics(supabase: any, startDate: Date) {
  const [
    { count: newUsers },
    { count: activeUsers },
    { data: sessions }
  ] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString()),
    supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('session_start', startDate.toISOString()),
    supabase
      .from('user_sessions')
      .select('page_views, questionnaire_completed, recommendations_viewed, products_clicked')
      .gte('session_start', startDate.toISOString())
  ]);

  const sessionStats = sessions?.reduce((acc: any, session: any) => ({
    totalPageViews: acc.totalPageViews + (session.page_views || 0),
    completedQuestionnaires: acc.completedQuestionnaires + (session.questionnaire_completed ? 1 : 0),
    viewedRecommendations: acc.viewedRecommendations + (session.recommendations_viewed || 0),
    clickedProducts: acc.clickedProducts + (session.products_clicked || 0)
  }), {
    totalPageViews: 0,
    completedQuestionnaires: 0,
    viewedRecommendations: 0,
    clickedProducts: 0
  }) || {};

  return {
    newUsers: newUsers || 0,
    activeUsers: activeUsers || 0,
    ...sessionStats,
    conversionRate: sessionStats.clickedProducts > 0 
      ? Math.round((sessionStats.clickedProducts / sessionStats.viewedRecommendations) * 100) / 100
      : 0
  };
}

// 获取产品指标
async function getProductMetrics(supabase: any, startDate: Date) {
  const { data: productStats } = await supabase
    .from('product_stats')
    .select('view_count, click_count, favorite_count, purchase_click_count')
    .gte('last_updated_at', startDate.toISOString());

  const metrics = productStats?.reduce((acc: any, stats: any) => ({
    totalViews: acc.totalViews + (stats.view_count || 0),
    totalClicks: acc.totalClicks + (stats.click_count || 0),
    totalFavorites: acc.totalFavorites + (stats.favorite_count || 0),
    totalPurchaseClicks: acc.totalPurchaseClicks + (stats.purchase_click_count || 0)
  }), {
    totalViews: 0,
    totalClicks: 0,
    totalFavorites: 0,
    totalPurchaseClicks: 0
  }) || {};

  return {
    ...metrics,
    clickThroughRate: metrics.totalViews > 0 
      ? Math.round((metrics.totalClicks / metrics.totalViews) * 10000) / 100
      : 0,
    favoriteRate: metrics.totalViews > 0
      ? Math.round((metrics.totalFavorites / metrics.totalViews) * 10000) / 100
      : 0
  };
}

// 获取收入数据
async function getRevenueData(supabase: any, startDate: Date) {
  const { data: revenueStats } = await supabase
    .from('daily_analytics')
    .select('affiliate_clicks, estimated_revenue, conversion_rate')
    .gte('date', startDate.toISOString().split('T')[0]);

  const revenue = revenueStats?.reduce((acc: any, day: any) => ({
    totalAffiliateClicks: acc.totalAffiliateClicks + (day.affiliate_clicks || 0),
    totalEstimatedRevenue: acc.totalEstimatedRevenue + (day.estimated_revenue || 0),
    avgConversionRate: acc.avgConversionRate + (day.conversion_rate || 0)
  }), {
    totalAffiliateClicks: 0,
    totalEstimatedRevenue: 0,
    avgConversionRate: 0
  }) || {};

  return {
    ...revenue,
    avgConversionRate: revenueStats?.length > 0 
      ? revenue.avgConversionRate / revenueStats.length 
      : 0
  };
}

// 获取热门产品
async function getTopProducts(supabase: any, startDate: Date) {
  const { data: topProducts } = await supabase
    .from('product_stats')
    .select(`
      product_id,
      view_count,
      click_count,
      favorite_count,
      purchase_click_count,
      lighting_products!inner(name, brand, price, images)
    `)
    .gte('last_updated_at', startDate.toISOString())
    .order('view_count', { ascending: false })
    .limit(10);

  return topProducts?.map((item: any) => ({
    id: item.product_id,
    name: item.lighting_products.name,
    brand: item.lighting_products.brand,
    price: item.lighting_products.price,
    image: item.lighting_products.images?.[0],
    metrics: {
      views: item.view_count,
      clicks: item.click_count,
      favorites: item.favorite_count,
      purchases: item.purchase_click_count
    }
  })) || [];
}

// 获取用户行为分析
async function getUserBehavior(supabase: any, startDate: Date) {
  const { data: interactions } = await supabase
    .from('product_interactions')
    .select('interaction_type, source, platform')
    .gte('interaction_at', startDate.toISOString());

  const behaviorStats = interactions?.reduce((acc: any, interaction: any) => {
    const type = interaction.interaction_type;
    const source = interaction.source || 'direct';
    const platform = interaction.platform || 'web';

    acc.byType[type] = (acc.byType[type] || 0) + 1;
    acc.bySource[source] = (acc.bySource[source] || 0) + 1;
    acc.byPlatform[platform] = (acc.byPlatform[platform] || 0) + 1;

    return acc;
  }, {
    byType: {},
    bySource: {},
    byPlatform: {}
  }) || { byType: {}, bySource: {}, byPlatform: {} };

  return behaviorStats;
}

// 获取每日趋势
async function getDailyTrends(supabase: any, startDate: Date) {
  const { data: dailyData } = await supabase
    .from('daily_analytics')
    .select('date, new_users, active_users, product_views, product_clicks, estimated_revenue')
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  return dailyData?.map((day: any) => ({
    date: day.date,
    newUsers: day.new_users || 0,
    activeUsers: day.active_users || 0,
    productViews: day.product_views || 0,
    productClicks: day.product_clicks || 0,
    revenue: day.estimated_revenue || 0
  })) || [];
}