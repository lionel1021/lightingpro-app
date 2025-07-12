'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { 
  Lightbulb, 
  Sparkles, 
  Zap, 
  Eye,
  ArrowRight,
  Download
} from 'lucide-react';

// 🚀 动态导入优化 - 只在需要时加载
const FramerMotion = dynamic(() => import('framer-motion').then(mod => ({ motion: mod.motion })), {
  loading: () => <div className="animate-pulse bg-gray-800 rounded-lg h-32" />,
  ssr: false
});

// 🎯 直接导入图标 - 确保可靠显示

// 🌟 优化的神经网络粒子系统
const OptimizedNeuralParticles = dynamic(() => {
  const NeuralParticles = () => {
    const [particles, setParticles] = useState<Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      opacity: number;
    }>>([]);
    
    useEffect(() => {
      // 🎯 根据设备性能调整粒子数量
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const isLowEnd = typeof window !== 'undefined' && 
        (window.navigator as any).hardwareConcurrency < 4;
      
      const particleCount = isMobile ? 15 : isLowEnd ? 25 : 50;
      
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3
      }));
      setParticles(newParticles);
    }, []);

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute bg-blue-400 rounded-full animate-pulse"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`
            }}
          />
        ))}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    );
  };
  return Promise.resolve({ default: NeuralParticles });
}, {
  loading: () => null,
  ssr: false
});

// 🌊 轻量化流体背景
const FluidBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-gradient" />
    <style jsx>{`
      @keyframes gradient {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      .animate-gradient {
        background-size: 200% 200%;
        animation: gradient 8s ease-in-out infinite;
      }
    `}</style>
  </div>
);

// 🎨 轻量化AI视觉元素
const AIVisualElement = ({ type, className = "" }: { type: string; className?: string }) => {
  const elements = {
    neural: (
      <div className={`w-full h-full ${className} flex items-center justify-center`}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="neuralGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#ff0080" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#00ff80" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8000ff" stopOpacity="0.9" />
            </radialGradient>
            <filter id="neuralGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <circle cx="32" cy="32" r="30" fill="url(#neuralGradient)" filter="url(#neuralGlow)" opacity="0.9">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
          </circle>
          
          <circle cx="32" cy="32" r="20" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="4,2" opacity="0.8">
            <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite"/>
          </circle>
          
          <circle cx="32" cy="32" r="12" fill="#ffffff" opacity="0.6">
            <animate attributeName="r" values="8;15;8" dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          
          <circle cx="32" cy="32" r="4" fill="#ff0080" opacity="0.9">
            <animate attributeName="fill" values="#ff0080;#00ff80;#8000ff;#ff0080" dur="4s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
    ),
    quantum: (
      <div className={`relative ${className}`}>
        <div className="w-full h-full rounded-full" style={{
          background: 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00)',
          boxShadow: '0 0 30px #00ffff, 0 0 60px #ff00ff',
          filter: 'brightness(1.5) contrast(1.3)'
        }} />
        <div className="absolute inset-1 rounded-full animate-pulse" style={{
          background: 'linear-gradient(45deg, #ffffff, #00ffff, #ff00ff)',
          boxShadow: '0 0 20px #ffffff'
        }} />
        <div className="absolute inset-2 rounded-full animate-bounce" style={{
          background: 'linear-gradient(45deg, #ffff00, #ff0080, #00ff80)',
          animationDuration: '2s',
          boxShadow: '0 0 15px #ffff00'
        }} />
        <div className="absolute inset-0 border-4 border-white rounded-full animate-spin shadow-2xl" style={{ 
          animationDuration: '3s',
          boxShadow: '0 0 25px #ffffff'
        }} />
        <div className="absolute inset-3 border-2 border-cyan-300 rounded-full animate-spin" style={{ 
          animationDuration: '4s', 
          animationDirection: 'reverse',
          boxShadow: '0 0 15px #67e8f9'
        }} />
        <div className="absolute inset-6 bg-white rounded-full animate-pulse" style={{
          boxShadow: '0 0 10px #ffffff'
        }} />
      </div>
    ),
    matrix: (
      <div className={`grid grid-cols-3 gap-1 ${className}`}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="bg-green-300 rounded-sm animate-pulse shadow-md shadow-green-400/50 border border-green-500"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    )
  };

  return elements[type as keyof typeof elements] || elements.neural;
};

// 🚀 优化的主组件
export default function OptimizedRevolutionary2025Design() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAdvancedAnimations, setShowAdvancedAnimations] = useState(false);

  // 🎯 检测设备性能
  useEffect(() => {
    const checkPerformance = () => {
      const isMobile = window.innerWidth < 768;
      const hasGoodHardware = (navigator as any).hardwareConcurrency >= 4;
      const hasGoodConnection = (navigator as any).connection?.effectiveType === '4g';
      
      setShowAdvancedAnimations(!isMobile && hasGoodHardware && hasGoodConnection);
    };

    checkPerformance();
    window.addEventListener('resize', checkPerformance);
    return () => window.removeEventListener('resize', checkPerformance);
  }, []);

  const features = [
    {
      icon: (
        <div className="w-8 h-8 text-white flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 4C7.6 4 4 7.6 4 12S7.6 20 12 20 20 16.4 20 12 16.4 4 12 4M12 6C15.3 6 18 8.7 18 12S15.3 18 12 18 6 15.3 6 12 8.7 6 12 6Z"/>
          </svg>
        </div>
      ),
      title: 'Neural Network Recommendations',
      description: 'Deep learning algorithms analyze your lifestyle',
      stats: '99.2% Accuracy',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: (
        <div className="w-8 h-8 text-white flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 8C13.1 8 14 8.9 14 10S13.1 12 12 12 10 11.1 10 10 10.9 8 12 8M12 6C9.8 6 8 7.8 8 10S9.8 14 12 14 16 12.2 16 10 14.2 6 12 6M6 10C6 13.3 8.7 16 12 16S18 13.3 18 10 15.3 4 12 4 6 6.7 6 10M4 10C4 5.6 7.6 2 12 2S20 5.6 20 10 16.4 18 12 18 4 14.4 4 10M12 18V22H8V20H16V22H12Z"/>
          </svg>
        </div>
      ),
      title: 'Quantum Rendering Engine', 
      description: 'Real-time 3D lighting effects preview',
      stats: '60fps Smooth',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: (
        <div className="w-8 h-8 text-white flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M15.5 14H20.5L22 15.5V20.5L20.5 22H15.5L14 20.5V15.5L15.5 14M19 19V17H17V19H19M9.5 14H14.5L16 15.5V20.5L14.5 22H9.5L8 20.5V15.5L9.5 14M13 19V17H11V19H13M3.5 14H8.5L10 15.5V20.5L8.5 22H3.5L2 20.5V15.5L3.5 14M7 19V17H5V19H7M9.5 8H14.5L16 9.5V14.5L14.5 16H9.5L8 14.5V9.5L9.5 8M13 13V11H11V13H13M15.5 2H20.5L22 3.5V8.5L20.5 10H15.5L14 8.5V3.5L15.5 2M19 7V5H17V7H19Z"/>
          </svg>
        </div>
      ),
      title: 'AR Space Scanning',
      description: 'One-click room scanning with smart layout suggestions', 
      stats: 'Millimeter Precision',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: (
        <div className="w-8 h-8 text-white flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M22 21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21M16 8H18V14H16V8M12 2H14V15H12V2M8 11H10V14H8V11M4 15H6V19H4V15Z"/>
          </svg>
        </div>
      ),
      title: 'Multi-Dimensional Analysis',
      description: 'Comprehensive optimization of lighting, color temperature, and energy consumption',
      stats: '7 Dimensions', 
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 🌊 轻量化流体背景 */}
      <FluidBackground />
      
      {/* 🌟 条件加载粒子系统 */}
      {showAdvancedAnimations && (
        <Suspense fallback={null}>
          <OptimizedNeuralParticles />
        </Suspense>
      )}

      {/* 🎮 顶部控制栏 */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">LightingPro 2025</span>
            </div>
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M14,19H18V5H14M6,19H10V5H6V19Z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                  </svg>
                )}
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                </svg>
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 主要内容区域 */}
      <div className="relative z-10">
        {/* 🚀 英雄区域 */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Revolutionary 2025 Design</span>
              </div>
              
              <h1 className="font-bold mb-6" style={{
                fontSize: 'clamp(2rem, 10vw, 5rem)',
                lineHeight: '1.1',
                letterSpacing: '-0.025em'
              }}>
                <span className="block mb-2" style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent'
                }}>
                  Redefining
                </span>
                <span className="block" style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent'
                }}>
                  Lighting Experience
                </span>
              </h1>
              
              <p className="text-white/90 mb-8 mx-auto" style={{
                fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                lineHeight: '1.6',
                maxWidth: 'min(90vw, 48rem)'
              }}>
                Neural network-powered intelligent lighting recommendation system that perfectly matches every ray of light to your lifestyle
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105">
                  <Zap className="w-5 h-5" />
                  Start AI Recommendations
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105">
                  <Eye className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* 🎨 3D可视化区域 */}
            <div className="relative max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i} 
                      className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-4 border border-white/10 hover:scale-105 transition-transform duration-300 flex flex-col h-48"
                    >
                      <div className="flex-shrink-0 mb-3">
                        <AIVisualElement type={['neural', 'quantum', 'matrix'][i]} className="w-16 h-16 mx-auto" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between text-center">
                        <h3 className="text-base font-semibold mb-2 text-white leading-tight">
                          {['Neural Analysis', 'Quantum Computing', 'Matrix Optimization'][i]}
                        </h3>
                        <p className="text-xs text-white/80 leading-relaxed px-1">
                          {['Deep learning user preferences', 'Real-time lighting effects rendering', 'Multi-dimensional data analysis'][i]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center gap-4 bg-black/20 rounded-full px-6 py-3">
                    <span className="text-sm text-white/70">Real-time Data</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm text-white">99.2% Accuracy</span>
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-sm text-white">1,247 Users Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🌟 功能特性区域 */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Next-Gen Lighting Technology
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                Revolutionary lighting solutions integrating AI, AR, and IoT to make smart lighting an integral part of your life
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="cursor-pointer h-full hover:scale-105 transition-transform duration-300"
                >
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                    <p className="text-white/80 text-sm mb-6 flex-grow leading-relaxed">{feature.description}</p>
                    <div className="bg-black/20 rounded-full px-4 py-2 text-xs text-green-400 font-medium">
                      {feature.stats}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 CTA区域 */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Ready to Begin?
              </h2>
              <p className="text-xl text-white/80 mb-10 leading-relaxed">
                Join the lighting revolution and experience unprecedented smart living
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105">
                  <Zap className="w-5 h-5" />
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105">
                  <Download className="w-5 h-5" />
                  Download App
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </div>
  );
}