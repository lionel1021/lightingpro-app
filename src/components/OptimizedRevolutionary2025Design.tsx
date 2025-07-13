'use client';

import { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Zap, 
  Eye,
  ArrowRight,
  Download
} from 'lucide-react';

// 🌟 简化的神经网络粒子系统
const NeuralParticles = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
  }>>([]);
  
  useEffect(() => {
    // 🎯 根据设备性能调整粒子数量 - 使用预计算值避免CSP违规
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isLowEnd = typeof window !== 'undefined' && 
      (window.navigator as any).hardwareConcurrency < 4;
    
    const particleCount = isMobile ? 15 : isLowEnd ? 25 : 50;
    
    // 预计算的粒子位置和属性，避免Math.random()
    const preCalculatedValues = [
      { x: 23, y: 45, size: 2.1, opacity: 0.7 },
      { x: 67, y: 12, size: 1.8, opacity: 0.5 },
      { x: 89, y: 78, size: 3.2, opacity: 0.8 },
      { x: 34, y: 56, size: 1.5, opacity: 0.6 },
      { x: 78, y: 23, size: 2.8, opacity: 0.4 },
      { x: 12, y: 89, size: 2.3, opacity: 0.7 },
      { x: 56, y: 34, size: 1.9, opacity: 0.5 },
      { x: 90, y: 67, size: 2.6, opacity: 0.8 },
      { x: 45, y: 12, size: 1.7, opacity: 0.6 },
      { x: 23, y: 78, size: 3.1, opacity: 0.4 },
      { x: 67, y: 45, size: 2.4, opacity: 0.7 },
      { x: 89, y: 23, size: 1.6, opacity: 0.5 },
      { x: 34, y: 89, size: 2.9, opacity: 0.8 },
      { x: 78, y: 56, size: 2.0, opacity: 0.6 },
      { x: 12, y: 34, size: 2.7, opacity: 0.4 }
    ];
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => {
      const base = preCalculatedValues[i % preCalculatedValues.length];
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
          className={`absolute bg-blue-400 rounded-full animate-float particle-${index}`}
        />
      ))}
    </div>
  );
};

// 🌊 轻量化流体背景
const FluidBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-gradient" />
  </div>
);

// 🎨 轻量化AI视觉元素
const AIVisualElement = ({ type, className = "" }: { type: string; className?: string }) => {
  // 检测是否为大尺寸图标
  const isLargeIcon = className.includes('w-16');
  const iconSize = isLargeIcon ? 'w-16 h-16' : 'w-11 h-11';
  const viewBoxSize = isLargeIcon ? '0 0 64 64' : '0 0 48 48';
  const gridSize = isLargeIcon ? 'w-16 h-16' : 'w-11 h-11';
  const quantumSize = isLargeIcon ? 'w-16 h-16' : 'w-11 h-11';
  
  const elements = {
    neural: (
      <div className={`w-full h-full ${className} flex items-center justify-center p-1`}>
        <svg viewBox={viewBoxSize} className={iconSize} style={{ filter: 'drop-shadow(0 0 4px rgba(96, 165, 250, 0.3))' }}>
          <defs>
            <linearGradient id={`neuralNodeGradient${isLargeIcon ? 'Large' : ''}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
            </linearGradient>
            <linearGradient id={`neuralConnectionGradient${isLargeIcon ? 'Large' : ''}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
            </linearGradient>
            <filter id={`neuralGlow${isLargeIcon ? 'Large' : ''}`}>
              <feGaussianBlur stdDeviation={isLargeIcon ? "1.5" : "1"} result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Neural Network Connections */}
          <g stroke={`url(#neuralConnectionGradient${isLargeIcon ? 'Large' : ''})`} strokeWidth={isLargeIcon ? "1.8" : "1.2"} fill="none" opacity="0.8">
            {/* Input to Hidden Layer 1 */}
            <line x1={isLargeIcon ? "12" : "8"} y1={isLargeIcon ? "16" : "12"} x2={isLargeIcon ? "28" : "20"} y2={isLargeIcon ? "22" : "16"}>
              <animate attributeName="stroke-opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite"/>
            </line>
            <line x1={isLargeIcon ? "12" : "8"} y1={isLargeIcon ? "32" : "24"} x2={isLargeIcon ? "28" : "20"} y2={isLargeIcon ? "22" : "16"}>
              <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite"/>
            </line>
            <line x1={isLargeIcon ? "12" : "8"} y1={isLargeIcon ? "48" : "36"} x2={isLargeIcon ? "28" : "20"} y2={isLargeIcon ? "22" : "16"}>
              <animate attributeName="stroke-opacity" values="0.5;0.8;0.5" dur="1.8s" repeatCount="indefinite"/>
            </line>
            
            {/* Input to Hidden Layer 2 */}
            <line x1={isLargeIcon ? "12" : "8"} y1={isLargeIcon ? "16" : "12"} x2={isLargeIcon ? "28" : "20"} y2={isLargeIcon ? "42" : "32"}>
              <animate attributeName="stroke-opacity" values="0.7;0.9;0.7" dur="2.4s" repeatCount="indefinite"/>
            </line>
            <line x1={isLargeIcon ? "12" : "8"} y1={isLargeIcon ? "32" : "24"} x2={isLargeIcon ? "28" : "20"} y2={isLargeIcon ? "42" : "32"}>
              <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
            </line>
            <line x1={isLargeIcon ? "12" : "8"} y1={isLargeIcon ? "48" : "36"} x2={isLargeIcon ? "28" : "20"} y2={isLargeIcon ? "42" : "32"}>
              <animate attributeName="stroke-opacity" values="0.6;0.8;0.6" dur="2.6s" repeatCount="indefinite"/>
            </line>
            
            {/* Hidden to Output */}
            <line x1={isLargeIcon ? "28" : "20"} y1={isLargeIcon ? "22" : "16"} x2={isLargeIcon ? "44" : "32"} y2={isLargeIcon ? "32" : "24"}>
              <animate attributeName="stroke-opacity" values="0.5;0.9;0.5" dur="1.9s" repeatCount="indefinite"/>
            </line>
            <line x1={isLargeIcon ? "28" : "20"} y1={isLargeIcon ? "42" : "32"} x2={isLargeIcon ? "44" : "32"} y2={isLargeIcon ? "32" : "24"}>
              <animate attributeName="stroke-opacity" values="0.7;1;0.7" dur="2.1s" repeatCount="indefinite"/>
            </line>
          </g>
          
          {/* Neural Nodes */}
          {/* Input Layer */}
          <circle cx={isLargeIcon ? "12" : "8"} cy={isLargeIcon ? "16" : "12"} r={isLargeIcon ? "3.5" : "2.5"} fill={`url(#neuralNodeGradient${isLargeIcon ? 'Large' : ''})`} filter={`url(#neuralGlow${isLargeIcon ? 'Large' : ''})`}>
            <animate attributeName="r" values={isLargeIcon ? "3;4;3" : "2;3;2"} dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx={isLargeIcon ? "12" : "8"} cy={isLargeIcon ? "32" : "24"} r={isLargeIcon ? "3.5" : "2.5"} fill={`url(#neuralNodeGradient${isLargeIcon ? 'Large' : ''})`} filter={`url(#neuralGlow${isLargeIcon ? 'Large' : ''})`}>
            <animate attributeName="r" values={isLargeIcon ? "3;4;3" : "2;3;2"} dur="2.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx={isLargeIcon ? "12" : "8"} cy={isLargeIcon ? "48" : "36"} r={isLargeIcon ? "3.5" : "2.5"} fill={`url(#neuralNodeGradient${isLargeIcon ? 'Large' : ''})`} filter={`url(#neuralGlow${isLargeIcon ? 'Large' : ''})`}>
            <animate attributeName="r" values={isLargeIcon ? "3;4;3" : "2;3;2"} dur="1.8s" repeatCount="indefinite"/>
          </circle>
          
          {/* Hidden Layer */}
          <circle cx={isLargeIcon ? "28" : "20"} cy={isLargeIcon ? "22" : "16"} r={isLargeIcon ? "4" : "3"} fill={`url(#neuralNodeGradient${isLargeIcon ? 'Large' : ''})`} filter={`url(#neuralGlow${isLargeIcon ? 'Large' : ''})`}>
            <animate attributeName="r" values={isLargeIcon ? "3.5;4.5;3.5" : "2.5;3.5;2.5"} dur="2.4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2.4s" repeatCount="indefinite"/>
          </circle>
          <circle cx={isLargeIcon ? "28" : "20"} cy={isLargeIcon ? "42" : "32"} r={isLargeIcon ? "4" : "3"} fill={`url(#neuralNodeGradient${isLargeIcon ? 'Large' : ''})`} filter={`url(#neuralGlow${isLargeIcon ? 'Large' : ''})`}>
            <animate attributeName="r" values={isLargeIcon ? "3.5;4.5;3.5" : "2.5;3.5;2.5"} dur="2.6s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2.6s" repeatCount="indefinite"/>
          </circle>
          
          {/* Output Layer */}
          <circle cx={isLargeIcon ? "44" : "32"} cy={isLargeIcon ? "32" : "24"} r={isLargeIcon ? "4.5" : "3.5"} fill={`url(#neuralNodeGradient${isLargeIcon ? 'Large' : ''})`} filter={`url(#neuralGlow${isLargeIcon ? 'Large' : ''})`}>
            <animate attributeName="r" values={isLargeIcon ? "4;5;4" : "3;4;3"} dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
          </circle>
          
          {/* Data Flow */}
          <circle cx={isLargeIcon ? "8" : "5"} cy={isLargeIcon ? "32" : "24"} r={isLargeIcon ? "1.5" : "1"} fill="#ffffff" opacity="0.9">
            <animate attributeName="cx" values={isLargeIcon ? "8;48;8" : "5;35;5"} dur="3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="3s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
    ),
    quantum: (
      <div className={`w-full h-full ${className} flex items-center justify-center p-1`}>
        <div className={`relative ${quantumSize}`} style={{ filter: 'drop-shadow(0 0 4px rgba(0, 255, 255, 0.3))' }}>
          <div className="w-full h-full rounded-full quantum-base" />
          <div className="absolute inset-1 rounded-full animate-pulse quantum-layer-1" />
          <div className="absolute inset-2 rounded-full animate-bounce quantum-layer-2" />
          <div className="absolute inset-0 border-3 border-white rounded-full animate-spin shadow-2xl quantum-border-1" />
          <div className="absolute inset-2 border border-cyan-300 rounded-full animate-spin quantum-border-2" />
          <div className="absolute inset-4 bg-white rounded-full animate-pulse quantum-center" />
        </div>
      </div>
    ),
    matrix: (
      <div className={`w-full h-full ${className} flex items-center justify-center p-1`}>
        <div className={`grid grid-cols-3 gap-1 ${gridSize}`} style={{ filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.3))' }}>
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
        <div className="w-16 h-16 flex items-center justify-center">
          <AIVisualElement type="neural" className="w-16 h-16" />
        </div>
      ),
      title: 'Neural Network Recommendations',
      description: 'Deep learning algorithms analyze your lifestyle',
      stats: '99.2% Accuracy',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: (
        <div className="w-16 h-16 flex items-center justify-center">
          <AIVisualElement type="quantum" className="w-16 h-16" />
        </div>
      ),
      title: 'Quantum Rendering Engine', 
      description: 'Real-time 3D lighting effects preview',
      stats: '60fps Smooth',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: (
        <div className="w-16 h-16 flex items-center justify-center">
          <svg viewBox="0 0 48 48" className="w-16 h-16" style={{ filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))' }}>
            <defs>
              <linearGradient id="arScanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#047857" stopOpacity="1" />
              </linearGradient>
              <filter id="arScanGlow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* AR 扫描网格 */}
            <g stroke="url(#arScanGradient)" strokeWidth="1.5" fill="none" opacity="0.8">
              {/* 网格线 */}
              <line x1="8" y1="8" x2="40" y2="8">
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
              </line>
              <line x1="8" y1="16" x2="40" y2="16">
                <animate attributeName="stroke-opacity" values="0.4;0.9;0.4" dur="2.2s" repeatCount="indefinite"/>
              </line>
              <line x1="8" y1="24" x2="40" y2="24">
                <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite"/>
              </line>
              <line x1="8" y1="32" x2="40" y2="32">
                <animate attributeName="stroke-opacity" values="0.4;0.8;0.4" dur="2.4s" repeatCount="indefinite"/>
              </line>
              <line x1="8" y1="40" x2="40" y2="40">
                <animate attributeName="stroke-opacity" values="0.3;0.7;0.3" dur="2.6s" repeatCount="indefinite"/>
              </line>
              
              {/* 垂直网格 */}
              <line x1="8" y1="8" x2="8" y2="40">
                <animate attributeName="stroke-opacity" values="0.4;0.9;0.4" dur="2.1s" repeatCount="indefinite"/>
              </line>
              <line x1="16" y1="8" x2="16" y2="40">
                <animate attributeName="stroke-opacity" values="0.5;0.8;0.5" dur="1.9s" repeatCount="indefinite"/>
              </line>
              <line x1="24" y1="8" x2="24" y2="40">
                <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="2.3s" repeatCount="indefinite"/>
              </line>
              <line x1="32" y1="8" x2="32" y2="40">
                <animate attributeName="stroke-opacity" values="0.4;0.7;0.4" dur="2.5s" repeatCount="indefinite"/>
              </line>
              <line x1="40" y1="8" x2="40" y2="40">
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2.7s" repeatCount="indefinite"/>
              </line>
            </g>
            
            {/* AR 扫描点 */}
            <circle cx="12" cy="12" r="2" fill="url(#arScanGradient)" filter="url(#arScanGlow)">
              <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="24" cy="16" r="2" fill="url(#arScanGradient)" filter="url(#arScanGlow)">
              <animate attributeName="r" values="1.5;2.5;1.5" dur="2.2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.7;1;0.7" dur="2.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="36" cy="20" r="2" fill="url(#arScanGradient)" filter="url(#arScanGlow)">
              <animate attributeName="r" values="1.5;2.5;1.5" dur="1.8s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;1;0.8" dur="1.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="16" cy="28" r="2" fill="url(#arScanGradient)" filter="url(#arScanGlow)">
              <animate attributeName="r" values="1.5;2.5;1.5" dur="2.4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2.4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="32" cy="36" r="2" fill="url(#arScanGradient)" filter="url(#arScanGlow)">
              <animate attributeName="r" values="1.5;2.5;1.5" dur="2.6s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2.6s" repeatCount="indefinite"/>
            </circle>
            
            {/* 扫描波 */}
            <circle cx="24" cy="24" r="5" fill="none" stroke="url(#arScanGradient)" strokeWidth="2" opacity="0.7">
              <animate attributeName="r" values="5;20;5" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="stroke-opacity" values="0.7;0.1;0.7" dur="3s" repeatCount="indefinite"/>
            </circle>
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
        <div className="w-16 h-16 flex items-center justify-center">
          <AIVisualElement type="matrix" className="w-16 h-16" />
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
      {showAdvancedAnimations && <NeuralParticles />}

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
              
              <h1 className="font-bold mb-6 hero-title">
                <span className="block mb-2 text-gradient-blue-purple">
                  Redefining
                </span>
                <span className="block text-gradient-orange">
                  Lighting Experience
                </span>
              </h1>
              
              <p className="text-gradient-neural-subtitle mb-8 mx-auto hero-subtitle font-medium">
                Neural network-powered intelligent lighting recommendation system that perfectly matches every ray of light to your lifestyle
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.href = '/questionnaire'}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Zap className="w-5 h-5" />
                  Start AI Recommendations
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={() => window.location.href = '/demo'}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Eye className="w-5 h-5 text-gradient-watch-demo" />
                  <span className="text-gradient-watch-demo">Watch Demo</span>
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
                      <div className="neural-text-container">
                        <h3 className="neural-title">
                          {['Neural Analysis', 'Quantum Computing', 'Matrix Optimization'][i]}
                        </h3>
                        <p className="neural-description">
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
                <button 
                  onClick={() => window.location.href = '/questionnaire'}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Zap className="w-5 h-5" />
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={() => window.location.href = '/products'}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Download className="w-5 h-5" />
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