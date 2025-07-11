'use client';

import { useState, useEffect } from 'react';
import { useClientTranslations, type Locale } from '@/lib/i18n-simple';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import ClientOnly from '@/components/ClientOnly';

export default function LanguageTestPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const t = useClientTranslations(locale);

  useEffect(() => {
    // Get locale from URL path
    const pathLocale = window.location.pathname.split('/')[1] as Locale;
    if (pathLocale) {
      setLocale(pathLocale);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Language Test Page
            </h1>
            <ClientOnly>
              <LanguageSwitcher />
            </ClientOnly>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
              <h2 className="text-xl font-semibold mb-2">Navigation</h2>
              <ul className="space-y-1">
                <li>Home: {t('navigation.home')}</li>
                <li>Products: {t('navigation.products')}</li>
                <li>Recommendations: {t('navigation.recommendations')}</li>
                <li>Favorites: {t('navigation.favorites')}</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 bg-green-50 p-4">
              <h2 className="text-xl font-semibold mb-2">Common Terms</h2>
              <ul className="space-y-1">
                <li>Loading: {t('common.loading')}</li>
                <li>Search: {t('common.search')}</li>
                <li>Price: {t('common.price')}</li>
                <li>Brand: {t('common.brand')}</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
              <h2 className="text-xl font-semibold mb-2">Home Page</h2>
              <ul className="space-y-1">
                <li>Title: {t('home.title')}</li>
                <li>Subtitle: {t('home.subtitle')}</li>
                <li>Hero Title: {t('home.heroTitle')}</li>
                <li>Start Questionnaire: {t('home.startQuestionnaire')}</li>
                <li>Browse Products: {t('home.browsProducts')}</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-500 bg-red-50 p-4">
              <h2 className="text-xl font-semibold mb-2">Products</h2>
              <ul className="space-y-1">
                <li>Title: {t('products.title')}</li>
                <li>Search Placeholder: {t('products.searchPlaceholder')}</li>
                <li>No Results: {t('products.noResults')}</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Debug Information</h3>
            <p>Current Cookie: <span id="current-cookie" className="font-mono"></span></p>
            <script dangerouslySetInnerHTML={{
              __html: `
                if (typeof document !== 'undefined') {
                  const cookieElement = document.getElementById('current-cookie');
                  if (cookieElement) {
                    cookieElement.textContent = document.cookie;
                  }
                }
              `
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}