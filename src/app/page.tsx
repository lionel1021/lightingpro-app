import { HomePageClient } from '@/components/HomePageClient';

// 强制缓存破坏 - 使用当前时间戳
const CACHE_BUSTER = Date.now();
const BUILD_TIME = new Date().toISOString();

const translations = {
  home: {
    subtitle: `✨ AI智能照明专家 [CACHE BUSTER: ${CACHE_BUSTER}]`,
    heroTitle: `🔥 LightingPro 2025 - 革命性AI照明设计 [已更新: ${BUILD_TIME}]`,
    heroSubtitle: `🕒 如果您看到这个时间戳，说明缓存问题已解决！构建时间: ${BUILD_TIME} | 体验神经网络驱动的推荐和前沿用户界面`,
    startQuestionnaire: "🧠 开始AI推荐",
    browsProducts: "⚡ 浏览智能产品", 
    featuredProducts: "✨ 精选产品",
    whyChooseUs: "🎯 为什么选择我们的革命性平台",
    features: {
      ai: {
        title: "🤖 神经网络AI",
        description: "先进的深度学习算法提供量子级精度的照明推荐"
      },
      quality: {
        title: "💎 顶级品质", 
        description: "来自顶级品牌的精选产品，经过AI验证的质量保证和用户满意度"
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

export default function Home() {
  return (
    <>
      {/* 缓存破坏元标签 */}
      <meta name="cache-control" content="no-cache, no-store, must-revalidate" />
      <meta name="pragma" content="no-cache" />
      <meta name="expires" content="0" />
      <meta name="build-time" content={BUILD_TIME} />
      <meta name="cache-buster" content={CACHE_BUSTER.toString()} />
      
      <HomePageClient translations={translations} locale="en" />
    </>
  );
}