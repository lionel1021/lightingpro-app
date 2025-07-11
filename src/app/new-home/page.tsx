import { HomePageClient } from '@/components/HomePageClient';

const translations = {
  home: {
    subtitle: "🚀 NEW VERSION CONFIRMED 🚀",
    heroTitle: "✨ 全新2025设计 - 缓存绕过测试版本 ✨",
    heroSubtitle: `🕒 构建时间: ${new Date().toISOString()} | 如果您看到这个页面，说明新设计已经成功部署！现在可以安全地使用新版本主页`,
    startQuestionnaire: "🧠 体验AI推荐",
    browsProducts: "⚡ 浏览智能产品",
    featuredProducts: "✨ 精选产品",
    whyChooseUs: "🎯 选择我们的革命性平台",
    features: {
      ai: {
        title: "🤖 神经网络AI",
        description: "先进的深度学习算法提供量子级精度的照明推荐"
      },
      quality: {
        title: "💎 顶级品质",
        description: "来自顶级品牌的精选产品，经过AI验证的质量保证"
      },
      expert: {
        title: "🎨 专家咨询",
        description: "专业照明设计师通过我们的AI增强咨询平台提供个性化指导"
      }
    }
  },
  navigation: {
    recommendations: "🎯 AI推荐",
    favorites: "❤️ 收藏夹"
  },
  products: {
    searchPlaceholder: "🔍 搜索智能照明产品..."
  },
  common: {
    brand: "🏷️ 品牌",
    category: "📂 分类"
  },
  authStatus: {
    user: "👤 用户",
    member: "⭐ 高级会员",
    profile: "👤 个人资料",
    myFavorites: "❤️ 我的收藏",
    myOrders: "📦 我的订单",
    accountSettings: "⚙️ 账户设置",
    signOut: "🚪 退出登录",
    signIn: "🔐 登录",
    signUp: "✨ 立即加入"
  }
};

export default function NewHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-green-500 text-white px-6 py-3 rounded-full text-lg font-bold mb-4 animate-pulse">
              🎉 新版本成功部署！🎉
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              🚀 LightingPro 2025 🚀
            </h1>
            <p className="text-xl text-gray-200 mb-6">
              恭喜！您看到这个页面说明部署完全成功！
            </p>
            <div className="bg-black/30 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-white mb-4">
                <strong>✅ 部署状态：</strong> 成功
              </p>
              <p className="text-white mb-4">
                <strong>🕒 构建时间：</strong> {new Date().toISOString()}
              </p>
              <p className="text-white mb-4">
                <strong>📋 测试页面：</strong> /new-home
              </p>
              <a 
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors text-lg font-semibold"
              >
                🏠 现在可以安全地访问主页
              </a>
            </div>
          </div>
        </div>
        <HomePageClient translations={translations} locale="en" />
      </div>
    </div>
  );
}