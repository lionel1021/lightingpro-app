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

// 🎯 按需导入图标
const Brain = dynamic(() => import('lucide-react/dist/esm/icons/brain'));
const Atom = dynamic(() => import('lucide-react/dist/esm/icons/atom'));
const Scan = dynamic(() => import('lucide-react/dist/esm/icons/scan'));
const Layers = dynamic(() => import('lucide-react/dist/esm/icons/layers'));
const Play = dynamic(() => import('lucide-react/dist/esm/icons/play'));
const Pause = dynamic(() => import('lucide-react/dist/esm/icons/pause'));
const Volume2 = dynamic(() => import('lucide-react/dist/esm/icons/volume-2'));
const Maximize = dynamic(() => import('lucide-react/dist/esm/icons/maximize'));

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
      <div className={`w-full h-full ${className} relative`}>
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-80" />
        <div className="absolute inset-2 border-2 border-white rounded-full animate-spin" 
             style={{ animationDuration: '3s' }} />
      </div>
    ),
    quantum: (
      <div className={`relative ${className} animate-spin`} style={{ animationDuration: '20s' }}>
        <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20" />
        <div className="absolute inset-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-30" />
        <div className="absolute inset-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-40" />
      </div>
    ),
    matrix: (
      <div className={`grid grid-cols-3 gap-1 ${className}`}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="bg-green-400 rounded-sm animate-pulse"
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
      icon: <Suspense fallback={<div className="w-8 h-8 bg-gray-400 rounded animate-pulse" />}><Brain className="w-8 h-8" /></Suspense>,
      title: 'Neural Network Recommendations',
      description: 'Deep learning algorithms analyze your lifestyle',
      stats: '99.2% Accuracy',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Suspense fallback={<div className="w-8 h-8 bg-gray-400 rounded animate-pulse" />}><Atom className="w-8 h-8" /></Suspense>,
      title: 'Quantum Rendering Engine', 
      description: 'Real-time 3D lighting effects preview',
      stats: '60fps Smooth',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Suspense fallback={<div className="w-8 h-8 bg-gray-400 rounded animate-pulse" />}><Scan className="w-8 h-8" /></Suspense>,
      title: 'AR Space Scanning',
      description: 'One-click room scanning with smart layout suggestions', 
      stats: 'Millimeter Precision',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: <Suspense fallback={<div className="w-8 h-8 bg-gray-400 rounded animate-pulse" />}><Layers className="w-8 h-8" /></Suspense>,
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
                <Suspense fallback={<div className="w-4 h-4 bg-gray-400 rounded" />}>
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Suspense>
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Suspense fallback={<div className="w-4 h-4 bg-gray-400 rounded" />}>
                  <Volume2 className="w-4 h-4" />
                </Suspense>
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Suspense fallback={<div className="w-4 h-4 bg-gray-400 rounded" />}>
                  <Maximize className="w-4 h-4" />
                </Suspense>
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
              
              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Redefining
                </span>
                <br />
                <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                  Lighting Experience
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
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
                      className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition-transform duration-300"
                    >
                      <AIVisualElement type={['neural', 'quantum', 'matrix'][i]} className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-white">
                        {['Neural Analysis', 'Quantum Computing', 'Matrix Optimization'][i]}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {['Deep learning user preferences', 'Real-time lighting effects rendering', 'Multi-dimensional data analysis'][i]}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center gap-4 bg-black/20 rounded-full px-6 py-3">
                    <span className="text-sm text-gray-400">Real-time Data</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm">99.2% Accuracy</span>
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-sm">1,247 Users Online</span>
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
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
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
                    <p className="text-gray-300 text-sm mb-6 flex-grow leading-relaxed">{feature.description}</p>
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
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
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