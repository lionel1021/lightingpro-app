'use client';

// 强制使用最新图标的固定主页
export default function FixedHomepage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 流体背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-gradient" />
      </div>
      
      {/* 主要内容区域 */}
      <div className="relative z-10">
        {/* 英雄区域 */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
                <div className="w-4 h-4 text-yellow-400">✨</div>
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
            </div>

            {/* 3D可视化区域 - 使用最新图标 */}
            <div className="relative max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {/* Neural Analysis - 超明亮版本 */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-4 border border-white/10 hover:scale-105 transition-transform duration-300 flex flex-col h-48">
                    <div className="flex-shrink-0 mb-3">
                      <div className="w-16 h-16 mx-auto flex items-center justify-center">
                        <svg viewBox="0 0 64 64" className="w-full h-full">
                          <defs>
                            <radialGradient id="fixedNeuralGradient" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                              <stop offset="30%" stopColor="#ff0080" stopOpacity="0.8" />
                              <stop offset="60%" stopColor="#00ff80" stopOpacity="0.7" />
                              <stop offset="100%" stopColor="#8000ff" stopOpacity="0.9" />
                            </radialGradient>
                            <filter id="fixedNeuralGlow">
                              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                              <feMerge> 
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          
                          <circle cx="32" cy="32" r="30" fill="url(#fixedNeuralGradient)" filter="url(#fixedNeuralGlow)" opacity="0.9">
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
                    </div>
                    <div className="flex-grow flex flex-col justify-between text-center">
                      <h3 className="text-base font-semibold mb-2 text-white leading-tight">
                        Neural Analysis
                      </h3>
                      <p className="text-xs text-white/80 leading-relaxed px-1">
                        Deep learning user preferences
                      </p>
                    </div>
                  </div>

                  {/* Quantum Computing - 超明亮版本 */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-4 border border-white/10 hover:scale-105 transition-transform duration-300 flex flex-col h-48">
                    <div className="flex-shrink-0 mb-3">
                      <div className="w-16 h-16 mx-auto relative">
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
                    </div>
                    <div className="flex-grow flex flex-col justify-between text-center">
                      <h3 className="text-base font-semibold mb-2 text-white leading-tight">
                        Quantum Computing
                      </h3>
                      <p className="text-xs text-white/80 leading-relaxed px-1">
                        Real-time lighting effects rendering
                      </p>
                    </div>
                  </div>

                  {/* Matrix Optimization */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-4 border border-white/10 hover:scale-105 transition-transform duration-300 flex flex-col h-48">
                    <div className="flex-shrink-0 mb-3">
                      <div className="w-16 h-16 mx-auto grid grid-cols-3 gap-1">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-green-300 rounded-sm animate-pulse border border-green-500"
                            style={{
                              animationDelay: `${i * 200}ms`,
                              boxShadow: '0 0 10px #22c55e'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex-grow flex flex-col justify-between text-center">
                      <h3 className="text-base font-semibold mb-2 text-white leading-tight">
                        Matrix Optimization
                      </h3>
                      <p className="text-xs text-white/80 leading-relaxed px-1">
                        Multi-dimensional data analysis
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center gap-4 bg-black/20 rounded-full px-6 py-3">
                    <span className="text-sm text-white/70">Real-time Data</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm text-white">99.2% Accuracy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}