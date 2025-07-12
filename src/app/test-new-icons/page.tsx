'use client';

import { useState, useEffect } from 'react';

// 极度明亮版图标组件
const SuperBrightIcons = () => {
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    setTimestamp(new Date().toLocaleString('zh-CN'));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-yellow-400">🔥 全新图标测试页面</h1>
        <p className="text-white/80 mb-8">页面生成时间: {timestamp}</p>
        
        <div className="bg-red-600 text-white p-4 rounded-lg mb-8">
          <h2 className="text-xl font-bold">🚨 如果这个页面能正常显示，说明网站已更新！</h2>
          <p>这是一个全新的页面，不受任何缓存影响</p>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* Neural Analysis - 简洁版本 */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 text-green-400">Neural Analysis</h3>
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-80"></div>
              <div className="absolute inset-2 border-2 border-white rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
            </div>
            <p className="text-white/80 text-sm">✅ 简洁版本</p>
          </div>

          {/* Quantum Computing - 超明亮版本 */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 text-green-400">Quantum Computing</h3>
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="w-full h-full rounded-full" style={{
                background: 'linear-gradient(45deg, #ecfeff, #67e8f9)',
                boxShadow: '0 0 20px #67e8f9'
              }}></div>
              <div className="absolute inset-1 rounded-full animate-pulse" style={{
                background: 'linear-gradient(45deg, #faf5ff, #d8b4fe)'
              }}></div>
              <div className="absolute inset-2 rounded-full animate-bounce" style={{
                background: 'linear-gradient(45deg, #fefce8, #fde047)',
                animationDuration: '2s'
              }}></div>
              <div className="absolute inset-0 border-4 border-white rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
              <div className="absolute inset-3 border-2 border-white rounded-full animate-spin" style={{
                animationDuration: '4s', 
                animationDirection: 'reverse'
              }}></div>
              <div className="absolute inset-6 bg-white rounded-full animate-pulse"></div>
            </div>
            <p className="text-white/80 text-sm">✅ 超明亮版本</p>
          </div>

          {/* Matrix Optimization */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 text-green-400">Matrix Optimization</h3>
            <div className="w-20 h-20 mx-auto mb-4 grid grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-green-300 rounded-sm animate-pulse border border-green-500"
                  style={{
                    animationDelay: `${i * 200}ms`,
                    boxShadow: '0 0 10px #22c55e'
                  }}
                ></div>
              ))}
            </div>
            <p className="text-white/80 text-sm">✅ 高对比度版本</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">📊 测试结果</h2>
          <div className="space-y-3">
            <p className="text-white/80">如果你能看到这个页面，说明网站已经更新到最新版本！</p>
            <p className="text-yellow-400">Quantum Computing 图标应该非常明亮，有多层动画效果。</p>
            <p className="text-green-400">Neural Analysis 图标应该是简洁的蓝紫圆形 + 白色旋转边框。</p>
          </div>
        </div>

        <div className="mt-8">
          <a href="/" className="bg-blue-500 px-6 py-3 rounded-lg font-semibold inline-block hover:bg-blue-600 mr-4">
            🏠 返回主页查看效果
          </a>
          <p className="text-white/60 text-sm mt-4">
            主页地址: https://lightingpro.netlify.app
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperBrightIcons;