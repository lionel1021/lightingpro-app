'use client';

import PerformanceMonitor from '@/components/PerformanceMonitor';

// 🎯 统一的移动端修复版本 - 无条件应用 - 简化版本
export default function Home() {
  return (
    <>
      <PerformanceMonitor />
      
      {/* 🔧 移动端优化的主页面 */}
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* 背景效果 */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-purple-950/20 to-pink-950/30"></div>
          {/* 简化的粒子效果 */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-40 left-20 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          {/* 顶部标识 */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-black/80 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/20">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-yellow-400">💡</span>
                <span className="font-medium">LightingPro 2025</span>
                <span className="text-green-400 text-xs">Mobile Fixed</span>
              </div>
            </div>
          </div>

          {/* 主要内容区域 */}
          <section className="min-h-screen flex items-center justify-center pt-20 pb-16">
            <div className="w-full text-center max-w-4xl mx-auto">
              
              {/* 徽章 */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/10">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm font-medium">Revolutionary 2025 Design</span>
                <span className="text-yellow-400">⭐</span>
              </div>
              
              {/* 🎯 主标题 - 强制修复版本 */}
              <div className="mb-8">
                <h1 
                  className="font-bold mb-4 px-4"
                  style={{
                    fontSize: 'clamp(2rem, 12vw, 4rem)',
                    lineHeight: '1.1',
                    letterSpacing: '-0.02em',
                    textAlign: 'center'
                  }}
                >
                  <div 
                    className="block mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      fontSize: 'inherit',
                      fontWeight: 'inherit'
                    }}
                  >
                    Redefining
                  </div>
                  <div 
                    className="block"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      fontSize: 'inherit',
                      fontWeight: 'inherit'
                    }}
                  >
                    Lighting Experience
                  </div>
                </h1>
                
                {/* 副标题 */}
                <p 
                  className="text-gray-300 mb-8 mx-auto px-4"
                  style={{
                    fontSize: 'clamp(1rem, 5vw, 1.25rem)',
                    lineHeight: '1.6',
                    maxWidth: '600px'
                  }}
                >
                  Neural network-powered intelligent lighting recommendation system
                </p>
              </div>

              {/* 行动按钮 */}
              <div className="flex flex-col gap-4 max-w-sm mx-auto mb-12">
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
                  <span>⚡</span>
                  <span>Start AI Recommendations</span>
                  <span>→</span>
                </button>
                
                <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95">
                  <span>👁</span>
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* 功能展示区域 */}
              <div className="relative">
                <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Neural Analysis */}
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-white/10 hover:scale-105 transition-transform duration-300">
                      <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🧠</span>
                      </div>
                      <h3 
                        className="font-semibold mb-2 text-white"
                        style={{
                          fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                          lineHeight: '1.3'
                        }}
                      >
                        Neural Analysis
                      </h3>
                      <p 
                        className="text-gray-400"
                        style={{
                          fontSize: 'clamp(0.625rem, 2.5vw, 0.875rem)',
                          lineHeight: '1.4'
                        }}
                      >
                        Deep learning preferences
                      </p>
                    </div>
                    
                    {/* Quantum Computing */}
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/10 hover:scale-105 transition-transform duration-300">
                      <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">⚛️</span>
                      </div>
                      <h3 
                        className="font-semibold mb-2 text-white"
                        style={{
                          fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                          lineHeight: '1.3'
                        }}
                      >
                        Quantum Computing
                      </h3>
                      <p 
                        className="text-gray-400"
                        style={{
                          fontSize: 'clamp(0.625rem, 2.5vw, 0.875rem)',
                          lineHeight: '1.4'
                        }}
                      >
                        Real-time effects
                      </p>
                    </div>
                    
                    {/* Matrix Optimization */}
                    <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-4 border border-white/10 hover:scale-105 transition-transform duration-300">
                      <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🔢</span>
                      </div>
                      <h3 
                        className="font-semibold mb-2 text-white"
                        style={{
                          fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                          lineHeight: '1.3'
                        }}
                      >
                        Matrix Optimization
                      </h3>
                      <p 
                        className="text-gray-400"
                        style={{
                          fontSize: 'clamp(0.625rem, 2.5vw, 0.875rem)',
                          lineHeight: '1.4'
                        }}
                      >
                        Multi-dimensional data
                      </p>
                    </div>
                  </div>
                  
                  {/* 状态栏 */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-3 bg-black/30 rounded-full px-4 py-2 border border-white/10">
                      <span 
                        className="text-gray-400"
                        style={{ fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)' }}
                      >
                        Real-time Data
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span 
                          className="text-green-400"
                          style={{ fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)' }}
                        >
                          99.2% Accuracy
                        </span>
                      </div>
                      <div className="w-px h-3 bg-white/20"></div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                        <span 
                          className="text-blue-400"
                          style={{ fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)' }}
                        >
                          1,247 Users Online
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 技术介绍区域 */}
          <section className="py-16">
            <div className="text-center mb-12 px-4">
              <h2 
                className="font-bold mb-6"
                style={{
                  fontSize: 'clamp(1.5rem, 8vw, 2.5rem)',
                  lineHeight: '1.2',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent'
                }}
              >
                Next-Gen Lighting Technology
              </h2>
              <p 
                className="text-gray-400 mx-auto"
                style={{
                  fontSize: 'clamp(0.875rem, 4vw, 1rem)',
                  lineHeight: '1.6',
                  maxWidth: '500px'
                }}
              >
                Revolutionary lighting solutions integrating AI, AR, and IoT technologies
              </p>
            </div>

            {/* 测试状态显示 */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-green-400 font-bold mb-4 text-lg">✅ Mobile Font Fix Applied</div>
                <div className="text-xs text-gray-300 space-y-2 text-left">
                  <div>🎯 clamp(2rem, 12vw, 4rem) - 主标题</div>
                  <div>📝 clamp(1rem, 5vw, 1.25rem) - 副标题</div>
                  <div>🔧 强制渐变文字透明度</div>
                  <div>📱 统一移动端适配</div>
                  <div>⚡ 无条件应用所有修复</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}