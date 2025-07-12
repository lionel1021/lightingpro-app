'use client';

export default function IconTest() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔧 图标测试页面</h1>
      
      <div className="space-y-6">
        <div className="bg-white/10 rounded-lg p-6">
          <h2 className="text-xl mb-4">功能图标测试：</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 text-center">
              <div className="w-12 h-12 text-white text-3xl flex items-center justify-center mx-auto mb-2">
                🧠
              </div>
              <div className="text-sm font-semibold">Neural Network</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 text-center">
              <div className="w-12 h-12 text-white text-3xl flex items-center justify-center mx-auto mb-2">
                ⚛️
              </div>
              <div className="text-sm font-semibold">Quantum Computing</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-4 text-center">
              <div className="w-12 h-12 text-white text-3xl flex items-center justify-center mx-auto mb-2">
                🔍
              </div>
              <div className="text-sm font-semibold">AR Scanning</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-4 text-center">
              <div className="w-12 h-12 text-white text-3xl flex items-center justify-center mx-auto mb-2">
                📊
              </div>
              <div className="text-sm font-semibold">Multi-Dimensional</div>
            </div>
            
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-6">
          <h2 className="text-xl mb-4">控制图标测试：</h2>
          <div className="flex gap-4">
            <button className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <span className="text-lg">▶️</span>
            </button>
            <button className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <span className="text-lg">⏸️</span>
            </button>
            <button className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <span className="text-lg">🔊</span>
            </button>
            <button className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <span className="text-lg">⛶</span>
            </button>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-6">
          <h2 className="text-xl mb-4">Unicode 测试：</h2>
          <div className="text-2xl space-x-4">
            <span>🧠 Brain U+1F9E0</span>
            <span>⚛️ Atom U+269B U+FE0F</span>
            <span>🔍 Magnifying Glass U+1F50D</span>
            <span>📊 Bar Chart U+1F4CA</span>
          </div>
        </div>
        
        <div className="bg-green-500/20 rounded-lg p-4">
          <p className="text-green-400 font-semibold">
            ✅ 如果您能看到上面的所有 emoji 图标，说明图标系统工作正常！
          </p>
        </div>
        
        <div className="text-center">
          <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
            返回主页
          </a>
        </div>
      </div>
    </div>
  );
}