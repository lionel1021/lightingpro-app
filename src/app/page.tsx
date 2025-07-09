'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Zap, Target, Star, TrendingUp, Users, Award } from "lucide-react";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { CartIcon } from "@/components/CartIcon";
import { AuthStatus } from "@/components/AuthStatus";
import { LanguageSwitcherSimple } from "@/components/LanguageSwitcherSimple";
import ClientOnly from "@/components/ClientOnly";
import { Suspense } from "react";
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Lightbulb className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">LightingPro</h1>
                <div className="text-xs text-blue-600 font-medium">{t('subtitle')}</div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/questionnaire" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                推荐
              </Link>
              <Link href="/search" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                搜索
              </Link>
              <Link href="/favorites" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                收藏
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <ClientOnly fallback={<div className="w-16 h-10 bg-gray-200 rounded animate-pulse" />}>
                <LanguageSwitcherSimple />
              </ClientOnly>
              <ClientOnly fallback={<div className="w-16 h-10 bg-gray-200 rounded animate-pulse" />}>
                <CartIcon />
              </ClientOnly>
              <ClientOnly fallback={<div className="w-20 h-10 bg-gray-200 rounded animate-pulse" />}>
                <AuthStatus />
              </ClientOnly>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              56+ 精选产品
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t('heroTitle')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('heroSubtitle')}
          </p>
          
          {/* 统计数据 */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">56+</div>
              <div className="text-sm text-gray-600">{t('featuredProducts')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-sm text-gray-600">品牌</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">类别</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/questionnaire">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Zap className="mr-2 h-5 w-5" />
                {t('startQuestionnaire')}
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Target className="mr-2 h-5 w-5" />
                {t('browsProducts')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t('featuredProducts')}
            </h3>
            <p className="text-gray-600">
              {t('features.quality.description')}
            </p>
          </div>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
              ))}
            </div>
          }>
            <FeaturedProducts />
          </Suspense>
          <div className="text-center mt-8">
            <Link href="/products">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                {t('browsProducts')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            为什么选择LightingPro
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">智能AI推荐</CardTitle>
                <CardDescription className="text-gray-600">
                  基于先进AI算法，为您量身定制最适合的照明方案
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">精选品牌</CardTitle>
                <CardDescription className="text-gray-600">
                  汇集飞利浦、小米、IKEA等国际知名品牌的优质产品
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">快速便捷</CardTitle>
                <CardDescription className="text-gray-600">
                  2分钟快速问卷，即刻获得个性化照明产品推荐
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            如何使用
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-blue-600 text-2xl">📝</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900">填写需求</h4>
              <p className="text-gray-600">回答简单问题，描述您的房间类型、风格偏好和预算</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-green-600 text-2xl">🎯</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900">AI智能匹配</h4>
              <p className="text-gray-600">AI算法分析您的需求，从56+产品中精选推荐</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-purple-600 text-2xl">🛒</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900">选购产品</h4>
              <p className="text-gray-600">浏览推荐产品，比较功能和价格，找到完美选择</p>
            </div>
          </div>

          {/* 数据展示 */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">2分钟</div>
                <div className="text-sm text-gray-600">快速问卷</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-sm text-gray-600">匹配准确率</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
                <div className="text-sm text-gray-600">产品类别</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">在线支持</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            准备好改变您的照明体验了吗？
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            立即开始，获得专为您定制的照明解决方案
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/questionnaire">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
                <Zap className="mr-2 h-5 w-5" />
                立即开始
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Target className="mr-2 h-5 w-5" />
                浏览产品
              </Button>
            </Link>
          </div>

          {/* 信任标识 */}
          <div className="flex justify-center items-center gap-8 text-blue-100 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>4.8★ 用户评分</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>1000+ 信赖用户</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>95% 准确率</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lightbulb className="h-6 w-6" />
            <span className="text-lg font-semibold">LightingPro</span>
          </div>
          <p className="text-gray-400">
            专业的AI智能照明推荐平台，为您的家居照明提供完美解决方案
          </p>
        </div>
      </footer>
    </div>
  );
}