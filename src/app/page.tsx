import { HomePageClient } from '@/components/HomePageClient';

// Static English translations
const translations = {
  home: {
    subtitle: "AI Smart Lighting Expert",
    heroTitle: "LightingPro - AI Smart Lighting Expert",
    heroSubtitle: "Get personalized lighting product recommendations based on your room type, style preferences, and budget",
    startQuestionnaire: "Start Smart Recommendations",
    browsProducts: "Browse All Products",
    featuredProducts: "Featured Products",
    whyChooseUs: "Why Choose Us",
    features: {
      ai: {
        title: "AI Smart Recommendations",
        description: "Advanced algorithms recommend the most suitable lighting products for you"
      },
      quality: {
        title: "Quality Products",
        description: "Carefully selected from renowned brands to ensure product quality and user experience"
      },
      expert: {
        title: "Professional Advice",
        description: "Professional lighting consultants provide one-on-one consultation services"
      }
    }
  },
  navigation: {
    recommendations: "Recommendations",
    favorites: "Favorites"
  },
  products: {
    searchPlaceholder: "Search lighting products..."
  },
  common: {
    brand: "Brand",
    category: "Category"
  },
  authStatus: {
    user: "User",
    member: "Member",
    profile: "Profile",
    myFavorites: "My Favorites",
    myOrders: "My Orders",
    accountSettings: "Account Settings",
    signOut: "Sign Out",
    signIn: "Sign In",
    signUp: "Sign Up"
  }
};

export default function Home() {
  return <HomePageClient translations={translations} locale="en" />;
}