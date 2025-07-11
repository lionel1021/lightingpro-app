'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CriticalCSSInline, NonCriticalCSSLoader } from '@/components/CriticalCSS';
import PerformanceMonitor from '@/components/PerformanceMonitor';

// 🚀 动态导入优化组件
const OptimizedRevolutionary2025Design = dynamic(() => import('@/components/OptimizedRevolutionary2025Design'), {
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-white text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
      <p>Loading Revolutionary Design...</p>
    </div>
  </div>,
  ssr: false
});

const MobileOptimizedRevolutionary2025Design = dynamic(() => import('@/components/MobileOptimizedRevolutionary2025Design'), {
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-white text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-3"></div>
      <p className="text-sm">Loading Mobile Design...</p>
    </div>
  </div>,
  ssr: false
});

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
      <>
        <CriticalCSSInline />
        <NonCriticalCSSLoader />
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
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-sm font-semibold text-green-400">⚡ Render Optimized</h3>
                <p className="text-xs text-gray-400">Critical CSS inline, non-blocking resources</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-400">🚀 Revolutionary Design Loading</h3>
                <p className="text-xs text-gray-400">Neural particles and 3D effects ready</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-400">🌐 Performance Enhanced</h3>
                <p className="text-xs text-gray-400">Optimized for Core Web Vitals</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 🎯 根据设备类型返回优化的组件
  return (
    <>
      <PerformanceMonitor />
      {isMobile ? <MobileOptimizedRevolutionary2025Design /> : <OptimizedRevolutionary2025Design />}
    </>
  );
}