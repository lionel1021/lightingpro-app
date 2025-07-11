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
              
              <h1 className="font-bold mb-6 hero-title">
                <span className="block mb-2 text-gradient-blue-purple">
                  Redefining
                </span>
                <span className="block text-gradient-orange">
                  Lighting Experience
                </span>
              </h1>
              
              <p className="text-white/90 mb-8 mx-auto hero-subtitle">
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
                            <linearGradient id="fixedNeuralNodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
                              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
                            </linearGradient>
                            <linearGradient id="fixedNeuralConnectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
                              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
                            </linearGradient>
                            <filter id="fixedNeuralGlow">
                              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                              <feMerge> 
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          
                          {/* Neural Network Structure */}
                          <g stroke="url(#fixedNeuralConnectionGradient)" strokeWidth="1.5" fill="none" opacity="0.7">
                            <line x1="16" y1="20" x2="32" y2="24">
                              <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
                            </line>
                            <line x1="16" y1="32" x2="32" y2="24">
                              <animate attributeName="stroke-opacity" values="0.5;0.9;0.5" dur="2.2s" repeatCount="indefinite"/>
                            </line>
                            <line x1="16" y1="44" x2="32" y2="24">
                              <animate attributeName="stroke-opacity" values="0.4;0.7;0.4" dur="1.8s" repeatCount="indefinite"/>
                            </line>
                            <line x1="16" y1="20" x2="32" y2="40">
                              <animate attributeName="stroke-opacity" values="0.6;0.8;0.6" dur="2.4s" repeatCount="indefinite"/>
                            </line>
                            <line x1="16" y1="32" x2="32" y2="40">
                              <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite"/>
                            </line>
                            <line x1="16" y1="44" x2="32" y2="40">
                              <animate attributeName="stroke-opacity" values="0.5;0.7;0.5" dur="2.6s" repeatCount="indefinite"/>
                            </line>
                            <line x1="32" y1="24" x2="48" y2="32">
                              <animate attributeName="stroke-opacity" values="0.4;0.8;0.4" dur="1.9s" repeatCount="indefinite"/>
                            </line>
                            <line x1="32" y1="40" x2="48" y2="32">
                              <animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="2.1s" repeatCount="indefinite"/>
                            </line>
                          </g>
                          
                          {/* Neural Nodes */}
                          <circle cx="16" cy="20" r="4" fill="url(#fixedNeuralNodeGradient)" filter="url(#fixedNeuralGlow)">
                            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
                          </circle>
                          <circle cx="16" cy="32" r="4" fill="url(#fixedNeuralNodeGradient)" filter="url(#fixedNeuralGlow)">
                            <animate attributeName="r" values="3;5;3" dur="2.2s" repeatCount="indefinite"/>
                          </circle>
                          <circle cx="16" cy="44" r="4" fill="url(#fixedNeuralNodeGradient)" filter="url(#fixedNeuralGlow)">
                            <animate attributeName="r" values="3;5;3" dur="1.8s" repeatCount="indefinite"/>
                          </circle>
                          <circle cx="32" cy="24" r="5" fill="url(#fixedNeuralNodeGradient)" filter="url(#fixedNeuralGlow)">
                            <animate attributeName="r" values="4;6;4" dur="2.4s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.7;1;0.7" dur="2.4s" repeatCount="indefinite"/>
                          </circle>
                          <circle cx="32" cy="40" r="5" fill="url(#fixedNeuralNodeGradient)" filter="url(#fixedNeuralGlow)">
                            <animate attributeName="r" values="4;6;4" dur="2.6s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.7;1;0.7" dur="2.6s" repeatCount="indefinite"/>
                          </circle>
                          <circle cx="48" cy="32" r="6" fill="url(#fixedNeuralNodeGradient)" filter="url(#fixedNeuralGlow)">
                            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
                          </circle>
                          
                          {/* Data Flow */}
                          <circle cx="12" cy="32" r="2" fill="#ffffff" opacity="0.8">
                            <animate attributeName="cx" values="12;52;12" dur="3s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite"/>
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
                        <div className="w-full h-full rounded-full quantum-base" />
                        <div className="absolute inset-1 rounded-full animate-pulse quantum-layer-1" />
                        <div className="absolute inset-2 rounded-full animate-bounce quantum-layer-2" />
                        <div className="absolute inset-0 border-4 border-white rounded-full animate-spin shadow-2xl quantum-border-1" />
                        <div className="absolute inset-3 border-2 border-cyan-300 rounded-full animate-spin quantum-border-2" />
                        <div className="absolute inset-6 bg-white rounded-full animate-pulse quantum-center" />
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