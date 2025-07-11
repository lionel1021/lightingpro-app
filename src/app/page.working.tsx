import { Lightbulb, Sparkles, Zap, ArrowRight, Brain, Atom, Layers } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
      
      {/* Neural Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-400 rounded-full opacity-30 animate-pulse"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: (Math.random() * 2 + 3) + 's'
            }}
          />
        ))}
      </div>

      {/* Top Control Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">LightingPro 2025</span>
            </div>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">⏸️</button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">🔊</button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">🔍</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Revolutionary 2025 Design</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Redefining
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                Lighting Experience
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Neural network-powered intelligent lighting recommendation system that perfectly matches every ray of light to your lifestyle
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-105">
                <Zap className="w-5 h-5" />
                Start AI Recommendations
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105">
                👁️ Watch Demo
              </button>
            </div>
          </div>

          {/* 3D Visualization Area */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Neural Analysis Card */}
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 mx-auto">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Neural Analysis</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Deep learning user preferences</p>
                  <div className="bg-black/20 rounded-full px-3 py-1 text-xs text-green-400 font-medium mt-3">
                    99.2% Accuracy
                  </div>
                </div>

                {/* Quantum Computing Card */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 mx-auto">
                    <Atom className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Quantum Computing</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Real-time lighting effects rendering</p>
                  <div className="bg-black/20 rounded-full px-3 py-1 text-xs text-green-400 font-medium mt-3">
                    60fps Smooth
                  </div>
                </div>

                {/* Matrix Optimization Card */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mb-4 mx-auto">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Matrix Optimization</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Multi-dimensional data analysis</p>
                  <div className="bg-black/20 rounded-full px-3 py-1 text-xs text-green-400 font-medium mt-3">
                    7 Dimensions
                  </div>
                </div>
              </div>
              
              {/* Real-time Stats */}
              <div className="text-center">
                <div className="inline-flex items-center gap-4 bg-black/20 rounded-full px-6 py-3">
                  <span className="text-sm text-gray-400">Real-time Data</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">99.2% Accuracy</span>
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">1,247 Users Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-6xl font-bold mb-8 leading-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Next-Gen Lighting Technology
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Revolutionary lighting solutions integrating AI, AR, and IoT to make smart lighting an integral part of your life
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-105">
                <Zap className="w-5 h-5" />
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105">
                📱 Download App
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="fixed bottom-4 right-4 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg p-4 text-green-300">
        <div className="text-sm font-semibold">🎉 Network Fixed!</div>
        <div className="text-xs">macOS system-level network issues resolved</div>
      </div>
    </div>
  );
}