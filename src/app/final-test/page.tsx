'use client';

import { useState, useEffect } from 'react';

// 极简版图标测试 - 确认最新修复
export default function FinalTest() {
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    setTimestamp(new Date().toISOString());
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-red-400">🚨 最终图标测试</h1>
        <div className="bg-blue-600 text-white p-4 rounded-lg mb-8">
          <h2 className="text-xl font-bold">Neural Analysis 图标最终测试</h2>
          <p>生成时间: {timestamp}</p>
          <p>这个页面将显示最新修复后的图标效果</p>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* Neural Analysis - 超明亮版本 */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 text-yellow-400">Neural Analysis</h3>
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              {/* 最新的神经网络结构SVG */}
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <defs>
                  <linearGradient id="testNeuralNodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="testNeuralConnectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="testNeuralGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Neural Network Connections */}
                <g stroke="url(#testNeuralConnectionGradient)" strokeWidth="2" fill="none" opacity="0.7">
                  <line x1="15" y1="18" x2="32" y2="22">
                    <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
                  </line>
                  <line x1="15" y1="32" x2="32" y2="22">
                    <animate attributeName="stroke-opacity" values="0.5;0.9;0.5" dur="2.2s" repeatCount="indefinite"/>
                  </line>
                  <line x1="15" y1="46" x2="32" y2="22">
                    <animate attributeName="stroke-opacity" values="0.4;0.7;0.4" dur="1.8s" repeatCount="indefinite"/>
                  </line>
                  <line x1="15" y1="18" x2="32" y2="42">
                    <animate attributeName="stroke-opacity" values="0.6;0.8;0.6" dur="2.4s" repeatCount="indefinite"/>
                  </line>
                  <line x1="15" y1="32" x2="32" y2="42">
                    <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite"/>
                  </line>
                  <line x1="15" y1="46" x2="32" y2="42">
                    <animate attributeName="stroke-opacity" values="0.5;0.7;0.5" dur="2.6s" repeatCount="indefinite"/>
                  </line>
                  <line x1="32" y1="22" x2="49" y2="32">
                    <animate attributeName="stroke-opacity" values="0.4;0.8;0.4" dur="1.9s" repeatCount="indefinite"/>
                  </line>
                  <line x1="32" y1="42" x2="49" y2="32">
                    <animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="2.1s" repeatCount="indefinite"/>
                  </line>
                </g>
                
                {/* Neural Nodes */}
                <circle cx="15" cy="18" r="5" fill="url(#testNeuralNodeGradient)" filter="url(#testNeuralGlow)">
                  <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="15" cy="32" r="5" fill="url(#testNeuralNodeGradient)" filter="url(#testNeuralGlow)">
                  <animate attributeName="r" values="4;6;4" dur="2.2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="15" cy="46" r="5" fill="url(#testNeuralNodeGradient)" filter="url(#testNeuralGlow)">
                  <animate attributeName="r" values="4;6;4" dur="1.8s" repeatCount="indefinite"/>
                </circle>
                <circle cx="32" cy="22" r="6" fill="url(#testNeuralNodeGradient)" filter="url(#testNeuralGlow)">
                  <animate attributeName="r" values="5;7;5" dur="2.4s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2.4s" repeatCount="indefinite"/>
                </circle>
                <circle cx="32" cy="42" r="6" fill="url(#testNeuralNodeGradient)" filter="url(#testNeuralGlow)">
                  <animate attributeName="r" values="5;7;5" dur="2.6s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2.6s" repeatCount="indefinite"/>
                </circle>
                <circle cx="49" cy="32" r="7" fill="url(#testNeuralNodeGradient)" filter="url(#testNeuralGlow)">
                  <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
                </circle>
                
                {/* Data Flow Enhanced */}
                <circle cx="10" cy="32" r="2.5" fill="#ffffff" opacity="0.8">
                  <animate attributeName="cx" values="10;54;10" dur="3s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="10" cy="32" r="2" fill="#60a5fa" opacity="0.6">
                  <animate attributeName="cx" values="10;54;10" dur="3.2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3.2s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
            <p className="text-white/80 text-sm">✅ 神经网络结构 - 已优化尺寸</p>
            <p className="text-green-400 text-xs mt-2">紧凑清晰 + 与其他图标一致</p>
          </div>

          {/* Quantum Computing - 确认明亮版本 */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 text-yellow-400">Quantum Computing</h3>
            <div className="w-20 h-20 mx-auto mb-4 relative">
              {/* 最新的超明亮版本 */}
              <div className="w-full h-full rounded-full quantum-base"></div>
              <div className="absolute inset-1 rounded-full animate-pulse quantum-layer-1"></div>
              <div className="absolute inset-2 rounded-full animate-bounce quantum-layer-2"></div>
              <div className="absolute inset-0 border-4 border-white rounded-full animate-spin shadow-2xl quantum-border-1"></div>
              <div className="absolute inset-3 border-2 border-cyan-300 rounded-full animate-spin quantum-border-2"></div>
              <div className="absolute inset-6 bg-white rounded-full animate-pulse quantum-center"></div>
            </div>
            <p className="text-white/80 text-sm">✅ 应该是超明亮版本</p>
            <p className="text-green-400 text-xs mt-2">多层彩色动画 + 发光效果</p>
          </div>

          {/* Matrix Optimization */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 text-yellow-400">Matrix Optimization</h3>
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
            <p className="text-white/80 text-sm">✅ 保持不变</p>
            <p className="text-green-400 text-xs mt-2">高对比度绿色9宫格</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-bold mb-4">🎯 预期结果验证</h2>
          <div className="text-left space-y-2">
            <p className="text-white/90">✅ Neural Analysis: 如果看到神经网络节点结构+连接线+数据流动 = 设计成功</p>
            <p className="text-white/90">✅ Quantum Computing: 如果看到超明亮的青色+品红+黄色多层动画 = 修复成功</p>
            <p className="text-white/90">✅ Matrix: 如果看到绿色9宫格依次脉冲 = 正常显示</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-yellow-600/20 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-2">⚠️ 如果图标仍然不对</h3>
            <p className="text-white/80">说明浏览器缓存非常顽固，需要：</p>
            <ol className="text-left text-white/80 mt-2 space-y-1">
              <li>1. 完全关闭浏览器重新打开</li>
              <li>2. 使用不同浏览器访问</li>
              <li>3. 等待24小时让CDN完全更新</li>
              <li>4. 使用手机热点网络访问</li>
            </ol>
          </div>

          <a href="/" className="bg-blue-500 px-6 py-3 rounded-lg font-semibold inline-block hover:bg-blue-600">
            🏠 返回主页对比
          </a>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          <p>部署时间: {timestamp}</p>
          <p>测试URL: /final-test</p>
          <p>这是全新创建的页面，不受任何缓存影响</p>
        </div>
      </div>
    </div>
  );
}

// 强制页面重新渲染
export const dynamic = 'force-dynamic';