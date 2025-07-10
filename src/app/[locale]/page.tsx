import { getTranslations } from 'next-intl/server';
import { HomePageClient } from '@/components/HomePageClient';

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations();
  // Pass translations to client component
  const translations = {
    home: {
      subtitle: t('home.subtitle'),
      heroTitle: t('home.heroTitle'),
      heroSubtitle: t('home.heroSubtitle'),
      startQuestionnaire: t('home.startQuestionnaire'),
      browsProducts: t('home.browsProducts'),
      featuredProducts: t('home.featuredProducts'),
      whyChooseUs: t('home.whyChooseUs'),
      features: {
        ai: {
          title: t('home.features.ai.title'),
          description: t('home.features.ai.description')
        },
        quality: {
          title: t('home.features.quality.title'),
          description: t('home.features.quality.description')
        },
        expert: {
          title: t('home.features.expert.title'),
          description: t('home.features.expert.description')
        }
      }
    },
    navigation: {
      recommendations: t('navigation.recommendations'),
      favorites: t('navigation.favorites')
    },
    products: {
      searchPlaceholder: t('products.searchPlaceholder')
    },
    common: {
      brand: t('common.brand'),
      category: t('common.category')
    },
    authStatus: {
      user: t('authStatus.user'),
      member: t('authStatus.member'),
      profile: t('authStatus.profile'),
      myFavorites: t('authStatus.myFavorites'),
      myOrders: t('authStatus.myOrders'),
      accountSettings: t('authStatus.accountSettings'),
      signOut: t('authStatus.signOut'),
      signIn: t('authStatus.signIn'),
      signUp: t('authStatus.signUp')
    }
  };

  return <HomePageClient translations={translations} locale={locale} />;
}