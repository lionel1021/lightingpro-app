'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Sparkles, 
  Zap, 
  Eye,
  Play,
  Pause,
  Volume2,
  Maximize,
  ArrowRight,
  Download,
  Brain,
  Atom,
  Scan,
  Layers
} from 'lucide-react';

// 🌟 神经网络粒子系统
const NeuralParticles = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
  }>>([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.5 + 0.1
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute bg-blue-400 rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [particle.opacity, 0.1, particle.opacity]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// 🎯 3D悬浮卡片组件
const Float3DCard = ({ children, className = "", delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -10, 
        rotateX: 5, 
        rotateY: 5,
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      className={`transform-gpu perspective-1000 ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.15))'
      }}
    >
      {children}
    </motion.div>
  );
};

// 🌊 流体动画背景
const FluidBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 60%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

// 🎨 AI驱动的视觉元素
const AIVisualElement = ({ type, className = "" }: { type: string; className?: string }) => {
  const elements = {
    neural: (
      <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`}>
        <defs>
          <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          fill="url(#neural-gradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </svg>
    ),
    quantum: (
      <motion.div
        className={`relative ${className}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20" />
        <div className="absolute inset-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-30" />
        <div className="absolute inset-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-40" />
      </motion.div>
    ),
    matrix: (
      <div className={`grid grid-cols-3 gap-1 ${className}`}>
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-green-400 rounded-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    )
  };

  return elements[type as keyof typeof elements] || elements.neural;
};

// 🚀 主要UI预览组件
export default function Revolutionary2025Design() {
  const [isPlaying, setIsPlaying] = useState(true);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Neural Network Recommendations',
      description: 'Deep learning algorithms analyze your lifestyle',
      stats: '99.2% Accuracy',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Atom className="w-8 h-8" />,
      title: 'Quantum Rendering Engine',
      description: 'Real-time 3D lighting effects preview',
      stats: '60fps Smooth',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Scan className="w-8 h-8" />,
      title: 'AR Space Scanning',
      description: 'One-click room scanning with smart layout suggestions',
      stats: 'Millimeter Precision',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: 'Multi-Dimensional Analysis',
      description: 'Comprehensive optimization of lighting, color temperature, and energy consumption',
      stats: '7 Dimensions',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 🌊 Fluid Animation Background */}
      <FluidBackground />
      
      {/* 🌟 Neural Network Particle System */}
      <NeuralParticles />

      {/* 🎮 Top Control Bar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
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
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Volume2 className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 🎯 Main Content Area */}
      <div className="relative z-10">
        {/* 🚀 Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-lg"
                >
                  <Zap className="w-5 h-5" />
                  Start AI Recommendations
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>

            {/* 🎨 3D Visualization Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {[0, 1, 2].map((i) => (
                    <Float3DCard key={i} delay={i * 0.2}>
                      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10">
                        <AIVisualElement type={['neural', 'quantum', 'matrix'][i]} className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-white">
                          {['Neural Analysis', 'Quantum Computing', 'Matrix Optimization'][i]}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {['Deep learning user preferences', 'Real-time lighting effects rendering', 'Multi-dimensional data analysis'][i]}
                        </p>
                      </div>
                    </Float3DCard>
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
            </motion.div>
          </div>
        </section>

        {/* 🌟 Features Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Next-Gen Lighting Technology
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Revolutionary lighting solutions integrating AI, AR, and IoT to make smart lighting an integral part of your life
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer h-full"
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Ready to Begin?
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                Join the lighting revolution and experience unprecedented smart living
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-lg"
                >
                  <Zap className="w-5 h-5" />
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download App
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}