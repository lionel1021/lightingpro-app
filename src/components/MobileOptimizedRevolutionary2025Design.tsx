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
    // 移动端使用更少的粒子数量 - 使用预计算值避免CSP违规
    const particleCount = 15;
    
    // 预计算的移动端粒子位置和属性，避免Math.random()
    const mobilePreCalculatedValues = [
      { x: 25, y: 40, size: 1.8, opacity: 0.5 },
      { x: 70, y: 15, size: 1.5, opacity: 0.4 },
      { x: 85, y: 75, size: 2.2, opacity: 0.6 },
      { x: 30, y: 60, size: 1.3, opacity: 0.3 },
      { x: 75, y: 25, size: 2.0, opacity: 0.5 },
      { x: 15, y: 85, size: 1.7, opacity: 0.4 },
      { x: 60, y: 35, size: 1.9, opacity: 0.6 },
      { x: 90, y: 65, size: 1.6, opacity: 0.3 },
      { x: 40, y: 10, size: 2.1, opacity: 0.5 },
      { x: 20, y: 80, size: 1.4, opacity: 0.4 },
      { x: 65, y: 50, size: 2.3, opacity: 0.6 },
      { x: 95, y: 20, size: 1.2, opacity: 0.3 },
      { x: 35, y: 90, size: 1.8, opacity: 0.5 },
      { x: 80, y: 55, size: 1.6, opacity: 0.4 },
      { x: 10, y: 30, size: 2.0, opacity: 0.6 }
    ];
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => {
      const base = mobilePreCalculatedValues[i % mobilePreCalculatedValues.length];
      return {
        id: i,
        x: base.x,
        y: base.y,
        size: base.size,
        opacity: base.opacity
      };
    });
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => (
        <div
          key={particle.id}
          className={`absolute bg-blue-400 rounded-full animate-float mobile-particle-${index}`}
        />
      ))}
    </div>
  );
};

// 🎨 移动端AI视觉元素
const MobileAIVisualElement = ({ type, className = "" }: { type: string; className?: string }) => {
  const elements = {
    neural: (
      <div className={`w-full h-full ${className} flex items-center justify-center p-0.5`}>
        <svg viewBox="0 0 32 32" className="w-7 h-7" style={{ filter: 'drop-shadow(0 0 2px rgba(96, 165, 250, 0.4))' }}>
          <defs>
            <linearGradient id="mobileNeuralNodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="mobileNeuralConnectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
            </linearGradient>
            <filter id="mobileNeuralGlow">
              <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Neural Network Connections - 移动端优化 */}
          <g stroke="url(#mobileNeuralConnectionGradient)" strokeWidth="0.8" fill="none" opacity="0.7">
            {/* Input to Hidden */}
            <line x1="6" y1="8" x2="16" y2="12">
              <animate attributeName="stroke-opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite"/>
            </line>
            <line x1="6" y1="16" x2="16" y2="12">
              <animate attributeName="stroke-opacity" values="0.5;0.9;0.5" dur="2.2s" repeatCount="indefinite"/>
            </line>
            <line x1="6" y1="24" x2="16" y2="12">
              <animate attributeName="stroke-opacity" values="0.4;0.7;0.4" dur="1.8s" repeatCount="indefinite"/>
            </line>
            
            <line x1="6" y1="8" x2="16" y2="20">
              <animate attributeName="stroke-opacity" values="0.6;0.8;0.6" dur="2.4s" repeatCount="indefinite"/>
            </line>
            <line x1="6" y1="16" x2="16" y2="20">
              <animate attributeName="stroke-opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite"/>
            </line>
            <line x1="6" y1="24" x2="16" y2="20">
              <animate attributeName="stroke-opacity" values="0.5;0.7;0.5" dur="2.6s" repeatCount="indefinite"/>
            </line>
            
            {/* Hidden to Output */}
            <line x1="16" y1="12" x2="26" y2="16">
              <animate attributeName="stroke-opacity" values="0.5;0.8;0.5" dur="1.9s" repeatCount="indefinite"/>
            </line>
            <line x1="16" y1="20" x2="26" y2="16">
              <animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="2.1s" repeatCount="indefinite"/>
            </line>
          </g>
          
          {/* Neural Nodes - 移动端紧凑版 */}
          {/* Input Layer */}
          <circle cx="6" cy="8" r="1.8" fill="url(#mobileNeuralNodeGradient)" filter="url(#mobileNeuralGlow)">
            <animate attributeName="r" values="1.5;2;1.5" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="6" cy="16" r="1.8" fill="url(#mobileNeuralNodeGradient)" filter="url(#mobileNeuralGlow)">
            <animate attributeName="r" values="1.5;2;1.5" dur="2.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="6" cy="24" r="1.8" fill="url(#mobileNeuralNodeGradient)" filter="url(#mobileNeuralGlow)">
            <animate attributeName="r" values="1.5;2;1.5" dur="1.8s" repeatCount="indefinite"/>
          </circle>
          
          {/* Hidden Layer */}
          <circle cx="16" cy="12" r="2.2" fill="url(#mobileNeuralNodeGradient)" filter="url(#mobileNeuralGlow)">
            <animate attributeName="r" values="1.8;2.5;1.8" dur="2.4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2.4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="16" cy="20" r="2.2" fill="url(#mobileNeuralNodeGradient)" filter="url(#mobileNeuralGlow)">
            <animate attributeName="r" values="1.8;2.5;1.8" dur="2.6s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2.6s" repeatCount="indefinite"/>
          </circle>
          
          {/* Output Layer */}
          <circle cx="26" cy="16" r="2.5" fill="url(#mobileNeuralNodeGradient)" filter="url(#mobileNeuralGlow)">
            <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
          </circle>
          
          {/* Data Flow - 移动端简化 */}
          <circle cx="4" cy="16" r="0.8" fill="#ffffff" opacity="0.8">
            <animate attributeName="cx" values="4;28;4" dur="3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
    ),
    quantum: (
      <div className={`w-full h-full ${className} flex items-center justify-center p-0.5`}>
        <div className="relative w-7 h-7" style={{ filter: 'drop-shadow(0 0 2px rgba(0, 255, 255, 0.4))' }}>
          <div className="w-full h-full rounded-full mobile-quantum-base" />
          <div className="absolute inset-1 rounded-full animate-pulse mobile-quantum-layer-1" />
          <div className="absolute inset-1.5 rounded-full animate-bounce mobile-quantum-layer-2" />
          <div className="absolute inset-0 border-2 border-white rounded-full animate-spin shadow-lg mobile-quantum-border-1" />
          <div className="absolute inset-2 border border-cyan-300 rounded-full animate-spin mobile-quantum-border-2" />
          <div className="absolute inset-3 bg-white rounded-full animate-pulse mobile-quantum-center" />
        </div>
      </div>
    ),
    matrix: (
      <div className={`w-full h-full ${className} flex items-center justify-center p-0.5`}>
        <div className="grid grid-cols-3 gap-0.5 w-7 h-7" style={{ filter: 'drop-shadow(0 0 2px rgba(34, 197, 94, 0.4))' }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-green-300 rounded-sm animate-pulse shadow-md shadow-green-400/50 border border-green-500"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
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
              
              <h1 className="font-bold mb-6 px-4 mobile-hero-title">
                <span className="block mb-3 text-gradient-blue-purple">
                  Redefining
                </span>
                <span className="block text-gradient-orange">
                  Lighting Experience
                </span>
              </h1>
              
              <p className="text-gradient-neural-subtitle mb-8 mx-auto px-4 mobile-hero-subtitle font-medium">
                Neural network-powered intelligent lighting recommendation system that perfectly matches every ray of light to your lifestyle
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.location.href = '/questionnaire'}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Zap className="w-4 h-4" />
                  Start AI Recommendations
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={() => window.location.href = '/demo'}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Eye className="w-4 h-4 text-gradient-watch-demo" />
                  <span className="text-gradient-watch-demo">Watch Demo</span>
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
                      className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-2 border border-white/10 hover:scale-105 transition-transform duration-300 flex flex-col h-28"
                    >
                      <div className="flex-shrink-0 mb-1">
                        <MobileAIVisualElement type={['neural', 'quantum', 'matrix'][i]} className="w-8 h-8 mx-auto" />
                      </div>
                      <div className="neural-text-container">
                        <h3 className="neural-title">
                          {feature.title}
                        </h3>
                        <p className="neural-description">
                          {feature.description}
                        </p>
                      </div>
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
                <button 
                  onClick={() => window.location.href = '/questionnaire'}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Zap className="w-4 h-4" />
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={() => window.location.href = '/products'}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  Browse Products
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}