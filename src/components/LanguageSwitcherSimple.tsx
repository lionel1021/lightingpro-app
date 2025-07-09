'use client';

import { useState, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export function LanguageSwitcherSimple() {
  // 统一的初始状态，避免hydration不匹配
  const [currentLocale, setCurrentLocale] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 延迟获取cookie，确保组件先正确挂载
    setTimeout(() => {
      const getCookie = (name: string) => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };
      
      const savedLocale = getCookie('NEXT_LOCALE') || 'en';
      setCurrentLocale(savedLocale);
    }, 0);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    
    console.log(`切换语言：${currentLocale} -> ${newLocale}`);
    
    // 设置cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Strict`;
    
    // 立即重新加载页面
    window.location.reload();
  };

  if (!mounted) {
    // SSR时显示默认状态
    return (
      <div className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md">
        <span>🇺🇸</span>
        <span className="hidden sm:inline text-gray-700">English</span>
      </div>
    );
  }

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        type="button"
      >
        <span>{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-gray-700">
          {currentLanguage.name}
        </span>
        <svg 
          className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[120px]">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left ${
                  currentLocale === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
                type="button"
              >
                <span>{language.flag}</span>
                <span>{language.name}</span>
                {currentLocale === language.code && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
}