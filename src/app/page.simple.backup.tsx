import { Lightbulb, Sparkles, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Top Control Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">LightingPro 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8">
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
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Neural network-powered intelligent lighting recommendation system that perfectly matches every ray of light to your lifestyle
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-105">
                <Zap className="w-5 h-5" />
                Start AI Recommendations
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 mx-auto">
                <div className="w-8 h-8 bg-white rounded-full opacity-80" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Neural Analysis</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Deep learning user preferences</p>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 mx-auto">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-80" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Quantum Computing</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Real-time lighting effects rendering</p>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mb-4 mx-auto">
                <div className="grid grid-cols-3 gap-1 w-8 h-8">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="bg-green-400 rounded-sm" />
                  ))}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Matrix Optimization</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Multi-dimensional data analysis</p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="flex justify-center items-center gap-8 text-center">
              <div>
                <span className="text-sm text-gray-400">Real-time Data</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">99.2% Accuracy</span>
                </div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <span className="text-sm text-gray-400">Users Online</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">1,247 Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Next-Gen Lighting Technology
            </h2>
            <p className="text-gray-400 mb-6">
              Revolutionary lighting solutions integrating AI, AR, and IoT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}