'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const languages = [
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('zh');
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
    // 从cookie获取当前语言
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    
    const cookieLocale = getCookie('NEXT_LOCALE') || 'zh';
    setCurrentLocale(cookieLocale);
    
    console.log('Current locale from cookie:', cookieLocale);
  }, []);
  
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === currentLocale || !mounted || isChanging) return;
    
    console.log('Switching language from', currentLocale, 'to', newLocale);
    
    setIsOpen(false);
    setIsChanging(true);
    
    try {
      // 设置cookie
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Strict`;
      console.log('Cookie set, reloading page...');
      
      // 立即刷新页面
      window.location.reload();
    } catch (error) {
      console.error('Language switch failed:', error);
      setIsChanging(false);
    }
  };

  return (
    <div className="relative">
      {/* 简化的触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className={`flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${
          isChanging ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span>{currentLanguage?.flag}</span>
        <span className="hidden sm:inline text-gray-700">
          {isChanging ? 'Switching...' : currentLanguage?.name}
        </span>
        {!isChanging && (
          <svg 
            className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
        {isChanging && (
          <svg className="w-3 h-3 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
      </button>

      {/* 简化的下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[120px]">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentLocale === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
              {currentLocale === language.code && (
                <span className="ml-auto text-blue-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 点击外部关闭 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}