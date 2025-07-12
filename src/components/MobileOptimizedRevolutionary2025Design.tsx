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
              
              <p className="text-gray-300 mb-8 mx-auto px-4" style={{
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
                      <p className="text-xs text-gray-400 leading-tight">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 bg-black/20 rounded-full px-4 py-2">
                    <span className="text-xs text-gray-400">Real-time Data</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs">99.2% Accuracy</span>
                    </div>
                    <div className="w-px h-3 bg-white/20" />
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-xs">1,247 Users Online</span>
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
              <p className="text-gray-400 mx-auto" style={{
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
                  icon: <Brain className="w-6 h-6" />,
                  title: 'Neural Network Recommendations',
                  description: 'Deep learning algorithms analyze your lifestyle',
                  stats: '99.2% Accuracy',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: <Atom className="w-6 h-6" />,
                  title: 'Quantum Rendering Engine', 
                  description: 'Real-time 3D lighting effects preview',
                  stats: '60fps Smooth',
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  icon: <Layers className="w-6 h-6" />,
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
                    <p className="text-gray-300 text-xs sm:text-sm mb-3 leading-relaxed">{feature.description}</p>
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
              <p className="text-gray-400 mb-8 mx-auto px-4" style={{
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