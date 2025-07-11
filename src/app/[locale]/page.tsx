import { HomePageClient } from '@/components/HomePageClient';
import { t, type Locale } from '@/lib/i18n-simple';

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const currentLocale = locale as Locale;
  
  // Pass translations to client component
  const translations = {
    home: {
      subtitle: t('home.subtitle', currentLocale),
      heroTitle: t('home.heroTitle', currentLocale),
      heroSubtitle: t('home.heroSubtitle', currentLocale),
      startQuestionnaire: t('home.startQuestionnaire', currentLocale),
      browsProducts: t('home.browsProducts', currentLocale),
      featuredProducts: t('home.featuredProducts', currentLocale),
      whyChooseUs: t('home.whyChooseUs', currentLocale),
      features: {
        ai: {
          title: t('home.features.ai.title', currentLocale),
          description: t('home.features.ai.description', currentLocale)
        },
        quality: {
          title: t('home.features.quality.title', currentLocale),
          description: t('home.features.quality.description', currentLocale)
        },
        expert: {
          title: t('home.features.expert.title', currentLocale),
          description: t('home.features.expert.description', currentLocale)
        }
      }
    },
    navigation: {
      recommendations: t('navigation.recommendations', currentLocale),
      favorites: t('navigation.favorites', currentLocale)
    },
    products: {
      searchPlaceholder: t('products.searchPlaceholder', currentLocale)
    },
    common: {
      brand: t('common.brand', currentLocale),
      category: t('common.category', currentLocale)
    },
    authStatus: {
      user: t('authStatus.user', currentLocale),
      member: t('authStatus.member', currentLocale),
      profile: t('authStatus.profile', currentLocale),
      myFavorites: t('authStatus.myFavorites', currentLocale),
      myOrders: t('authStatus.myOrders', currentLocale),
      accountSettings: t('authStatus.accountSettings', currentLocale),
      signOut: t('authStatus.signOut', currentLocale),
      signIn: t('authStatus.signIn', currentLocale),
      signUp: t('authStatus.signUp', currentLocale)
    }
  };

  return <HomePageClient translations={translations} locale={locale} />;
}