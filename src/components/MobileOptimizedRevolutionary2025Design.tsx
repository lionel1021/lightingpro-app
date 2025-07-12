'use client';

import { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Zap, 
  Eye,
  ArrowRight,
  Download,
  Brain,
  Atom,
  Scan,
  Layers,
  Play,
  Pause,
  Volume2,
  Maximize
} from 'lucide-react';

// 🎯 移动端优化的神经网络粒子系统
const MobileNeuralParticles = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
  }>>([]);
  
  useEffect(() => {
    // 移动端使用更少的粒子数量
    const particleCount = 15;
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.2
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
    </div>
  );
};

// 🎨 移动端AI视觉元素
const MobileAIVisualElement = ({ type, className = "" }: { type: string; className?: string }) => {
  const elements = {
    neural: (
      <div className={`w-full h-full ${className} relative`}>
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-80" />
        <div className="absolute inset-2 border-2 border-white rounded-full animate-spin" 
             style={{ animationDuration: '3s' }} />
      </div>
    ),
    quantum: (
      <div className={`relative ${className}`}>
        <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-80" />
        <div className="absolute inset-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-60 animate-pulse" />
        <div className="absolute inset-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-80 animate-bounce" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-1 border-2 border-white rounded-full animate-spin" style={{ animationDuration: '3s' }} />
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

// 🚀 移动端优化的主组件
export default function MobileOptimizedRevolutionary2025Design() {
  const [isPlaying, setIsPlaying] = useState(true);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Neural Analysis',
      description: 'Deep learning user preferences',
      stats: '99.2% Accuracy',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Atom className="w-6 h-6" />,
      title: 'Quantum Computing', 
      description: 'Real-time lighting effects rendering',
      stats: '60fps Smooth',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Scan className="w-6 h-6" />,
      title: 'Matrix Optimization',
      description: 'Multi-dimensional data analysis',
      stats: 'Real-time',
      color: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 🌊 移动端流体背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-gradient" />
      </div>
      
      {/* 🌟 移动端粒子系统 */}
      <MobileNeuralParticles />

      {/* 🎮 移动端顶部控制栏 */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">LightingPro 2025</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <Volume2 className="w-3 h-3" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <Maximize className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 移动端主要内容区域 */}
      <div className="relative z-10 px-3 sm:px-4">
        {/* 🚀 移动端英雄区域 */}
        <section className="min-h-screen flex items-center justify-center pt-16">
          <div className="w-full text-center">
            <div className="mb-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4 border border-white/10">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span className="text-xs">Revolutionary 2025 Design</span>
              </div>
              
              <h1 className="font-bold mb-6 px-4" style={{ 
                fontSize: 'clamp(1.75rem, 8vw, 3rem)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}>
                <span className="block mb-3" style={{
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
              
              <p className="text-white/90 mb-8 mx-auto px-4" style={{
                fontSize: 'clamp(0.875rem, 4vw, 1.125rem)',
                lineHeight: '1.6',
                maxWidth: 'min(90vw, 24rem)'
              }}>
                Neural network-powered intelligent lighting recommendation system
              </p>
              
              <div className="flex flex-col gap-3">
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-105">
                  <Zap className="w-4 h-4" />
                  Start AI Recommendations
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105">
                  <Eye className="w-4 h-4" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* 🎨 移动端3D可视化区域 */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {features.map((feature, i) => (
                    <div 
                      key={i} 
                      className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-3 border border-white/10 hover:scale-105 transition-transform duration-300"
                    >
                      <MobileAIVisualElement type={['neural', 'quantum', 'matrix'][i]} className="w-8 h-8 mx-auto mb-2" />
                      <h3 className="text-xs sm:text-sm font-semibold mb-1 text-white leading-tight">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-white/80 leading-tight">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 bg-black/20 rounded-full px-4 py-2">
                    <span className="text-xs text-white/70">Real-time Data</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-white">99.2% Accuracy</span>
                    </div>
                    <div className="w-px h-3 bg-white/20" />
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-xs text-white">1,247 Users Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🌟 移动端功能特性区域 */}
        <section className="py-16">
          <div className="w-full">
            <div className="text-center mb-12 px-4">
              <h2 className="font-bold mb-6" style={{
                fontSize: 'clamp(1.5rem, 7vw, 2.5rem)',
                lineHeight: '1.25',
                background: 'linear-gradient(135deg, #67e8f9 0%, #60a5fa 50%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent'
              }}>
                Next-Gen Lighting<br className="sm:hidden" /> Technology
              </h2>
              <p className="text-white/80 mx-auto" style={{
                fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                lineHeight: '1.6',
                maxWidth: 'min(85vw, 22rem)'
              }}>
                Revolutionary lighting solutions integrating AI, AR, and IoT
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: (
                    <div className="w-6 h-6 text-white flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
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
                    <div className="w-6 h-6 text-white flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
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
                    <div className="w-6 h-6 text-white flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M22 21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21M16 8H18V14H16V8M12 2H14V15H12V2M8 11H10V14H8V11M4 15H6V19H4V15Z"/>
                      </svg>
                    </div>
                  ),
                  title: 'Multi-Dimensional Analysis',
                  description: 'Comprehensive optimization of lighting and energy',
                  stats: '7 Dimensions', 
                  color: 'from-orange-500 to-red-500'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-white leading-snug">{feature.title}</h3>
                    <p className="text-white/80 text-xs sm:text-sm mb-3 leading-relaxed">{feature.description}</p>
                    <div className="bg-black/20 rounded-full px-3 py-1 text-xs text-green-400 font-medium">
                      {feature.stats}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 移动端CTA区域 */}
        <section className="py-16 pb-24">
          <div className="w-full text-center">
            <div>
              <h2 className="font-bold mb-6 px-4" style={{
                fontSize: 'clamp(1.5rem, 7vw, 2.5rem)',
                lineHeight: '1.25',
                background: 'linear-gradient(135deg, #86efac 0%, #10b981 50%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent'
              }}>
                Ready to Begin?
              </h2>
              <p className="text-white/80 mb-8 mx-auto px-4" style={{
                fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                lineHeight: '1.6',
                maxWidth: 'min(85vw, 22rem)'
              }}>
                Join the lighting revolution and experience unprecedented smart living
              </p>
              
              <div className="flex flex-col gap-3">
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-105">
                  <Zap className="w-4 h-4" />
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105">
                  <Download className="w-4 h-4" />
                  Download App
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}