'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Zap, Target, Star, TrendingUp, Users, Award } from "lucide-react";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { CartIcon } from "@/components/CartIcon";
import { AuthStatus } from "@/components/AuthStatus";
import { LanguageSwitcherSimple } from "@/components/LanguageSwitcherSimple";
import { Suspense, useState, useEffect } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  LogOut, 
  Heart, 
  ShoppingBag, 
  UserPlus, 
  LogIn,
  Loader2,
  Crown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Translations = {
  home: {
    subtitle: string;
    heroTitle: string;
    heroSubtitle: string;
    startQuestionnaire: string;
    browsProducts: string;
    featuredProducts: string;
    whyChooseUs: string;
    features: {
      ai: { title: string; description: string };
      quality: { title: string; description: string };
      expert: { title: string; description: string };
    };
  };
  navigation: {
    recommendations: string;
    favorites: string;
  };
  products: {
    searchPlaceholder: string;
  };
  common: {
    brand: string;
    category: string;
  };
  authStatus: {
    user: string;
    member: string;
    profile: string;
    myFavorites: string;
    myOrders: string;
    accountSettings: string;
    signOut: string;
    signIn: string;
    signUp: string;
  };
};

type Props = {
  translations: Translations;
  locale: string;
};

export function HomePageClient({ translations: t, locale }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/${locale}`} className="flex items-center gap-2 group">
              <div className="relative">
                <Lightbulb className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">LightingPro</h1>
                <div className="text-xs text-blue-600 font-medium">{t.home.subtitle}</div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href={`/${locale}/questionnaire`} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                {t.navigation.recommendations}
              </Link>
              <Link href={`/${locale}/search`} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                {t.products.searchPlaceholder.replace('...', '')}
              </Link>
              <Link href={`/${locale}/favorites`} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                {t.navigation.favorites}
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <LanguageSwitcherSimple />
              <CartIcon />
              <AuthStatusWithTranslations translations={t.authStatus} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              56+ {t.home.featuredProducts}
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t.home.heroTitle}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t.home.heroSubtitle}
          </p>
          
          {/* 统计数据 */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">56+</div>
              <div className="text-sm text-gray-600">{t.home.featuredProducts}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-sm text-gray-600">{t.common.brand}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">{t.common.category}</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/questionnaire`}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Zap className="mr-2 h-5 w-5" />
                {t.home.startQuestionnaire}
              </Button>
            </Link>
            <Link href={`/${locale}/products`}>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Target className="mr-2 h-5 w-5" />
                {t.home.browsProducts}
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
              {t.home.featuredProducts}
            </h3>
            <p className="text-gray-600">
              {t.home.features.quality.description}
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
            <Link href={`/${locale}/products`}>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                {t.home.browsProducts}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t.home.whyChooseUs}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">{t.home.features.ai.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {t.home.features.ai.description}
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">{t.home.features.quality.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {t.home.features.quality.description}
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">{t.home.features.expert.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {t.home.features.expert.description}
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
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-blue-600 text-2xl">📝</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900">Tell Us Your Needs</h4>
              <p className="text-gray-600">Answer simple questions about your room type, style preferences, and budget</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-green-600 text-2xl">🎯</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900">AI Smart Matching</h4>
              <p className="text-gray-600">AI algorithms analyze your needs and recommend from 56+ curated products</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-purple-600 text-2xl">🛒</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900">Shop Products</h4>
              <p className="text-gray-600">Browse recommended products, compare features and prices, find your perfect choice</p>
            </div>
          </div>

          {/* 数据展示 */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">2min</div>
                <div className="text-sm text-gray-600">Quick Survey</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-sm text-gray-600">Match Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
                <div className="text-sm text-gray-600">Product Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Online Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Lighting Experience?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Start now and get lighting solutions customized for you
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href={`/${locale}/questionnaire`}>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
                <Zap className="mr-2 h-5 w-5" />
                Get Started
              </Button>
            </Link>
            <Link href={`/${locale}/products`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Target className="mr-2 h-5 w-5" />
                Browse Products
              </Button>
            </Link>
          </div>

          {/* 信任标识 */}
          <div className="flex justify-center items-center gap-8 text-blue-100 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>4.8★ User Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>1000+ Trusted Users</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>95% Accuracy</span>
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
            Professional AI-powered lighting recommendation platform for perfect home lighting solutions
          </p>
        </div>
      </footer>
    </div>
  );
}

// Auth Status component with translations passed as props
function AuthStatusWithTranslations({ translations }: { translations: Translations['authStatus'] }) {
  const { user, isAuthenticated, isGuest, loading, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  // 客户端挂载前显示统一的加载状态
  if (!mounted || loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  // 已登录状态
  if (isAuthenticated && user) {
    const initials = user.full_name 
      ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
      : user.email.substring(0, 2).toUpperCase();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url} alt={user.full_name || user.email} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium leading-none">
                  {user.full_name || translations.user}
                </p>
                <Badge variant="secondary" className="text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  {translations.member}
                </Badge>
              </div>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{translations.profile}</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/favorites" className="cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              <span>{translations.myFavorites}</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/orders" className="cursor-pointer">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>{translations.myOrders}</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>{translations.accountSettings}</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            {isSigningOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <span>{translations.signOut}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // 访客状态
  return (
    <div className="flex items-center gap-2">
      <Link href="/auth/signin">
        <Button variant="ghost" size="sm">
          <LogIn className="w-4 h-4 mr-2" />
          {translations.signIn}
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          {translations.signUp}
        </Button>
      </Link>
    </div>
  );
}