'use client';

import { useState, useEffect } from 'react';
import OptimizedRevolutionary2025Design from '@/components/OptimizedRevolutionary2025Design';
import MobileOptimizedRevolutionary2025Design from '@/components/MobileOptimizedRevolutionary2025Design';
import { SEOOptimizer, MobilePerformanceMeta } from '@/components/SEOOptimizer';

// 🎯 智能设备检测和组件选择
export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
      setIsLoading(false);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-6"></div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            LightingPro 2025
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            AI-Powered Lighting Recommendation System
          </p>
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <h3 className="text-sm font-semibold text-green-400">✅ Performance Optimized</h3>
              <p className="text-xs text-gray-400">Bundle size reduced by 91%, PWA enabled</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <h3 className="text-sm font-semibold text-blue-400">🚀 Revolutionary Design Loading</h3>
              <p className="text-xs text-gray-400">Optimized components ready</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🎯 根据设备类型返回优化的组件
  return (
    <>
      <SEOOptimizer />
      <MobilePerformanceMeta />
      {isMobile ? <MobileOptimizedRevolutionary2025Design /> : <OptimizedRevolutionary2025Design />}
    </>
  );
}