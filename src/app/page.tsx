import { HomePageClient } from '@/components/HomePageClient';

// 临时恢复原版本确保部署成功，然后再逐步升级
const translations = {
  home: {
    subtitle: "AI Smart Lighting Expert",
    heroTitle: "🔥 NETLIFY DEPLOY TEST - LightingPro 2025 [COMMIT: 821b508]",
    heroSubtitle: "Experience the future of lighting with neural network-powered recommendations and cutting-edge user interface",
    startQuestionnaire: "🧠 Start AI Recommendations",
    browsProducts: "⚡ Browse Smart Products",
    featuredProducts: "✨ Featured Products",
    whyChooseUs: "🎯 Why Choose Our Revolutionary Platform",
    features: {
      ai: {
        title: "🤖 Neural Network AI",
        description: "Advanced deep learning algorithms provide quantum-level precision in lighting recommendations"
      },
      quality: {
        title: "💎 Premium Quality",
        description: "Curated selection from top-tier brands with AI-verified quality assurance and user satisfaction"
      },
      expert: {
        title: "🎨 Expert Consultation",
        description: "Professional lighting designers provide personalized guidance using our AI-enhanced consultation platform"
      }
    }
  },
  navigation: {
    recommendations: "🎯 AI Recommendations",
    favorites: "❤️ Favorites"
  },
  products: {
    searchPlaceholder: "🔍 Search intelligent lighting products..."
  },
  common: {
    brand: "🏷️ Brand",
    category: "📂 Category"
  },
  authStatus: {
    user: "👤 User",
    member: "⭐ Premium Member",
    profile: "👤 Profile",
    myFavorites: "❤️ My Favorites",
    myOrders: "📦 My Orders",
    accountSettings: "⚙️ Account Settings",
    signOut: "🚪 Sign Out",
    signIn: "🔐 Sign In",
    signUp: "✨ Join Now"
  }
};

export default function Home() {
  return <HomePageClient translations={translations} locale="en" />;
}