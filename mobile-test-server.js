#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8888;

// 提供静态文件服务
app.use(express.static(path.join(__dirname, '.next/static')));
app.use(express.static(path.join(__dirname, 'public')));

// 创建简化的测试页面
const testHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LightingPro 2025 - Mobile Test</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    animation: {
                        'gradient': 'gradient 8s ease-in-out infinite',
                    }
                }
            }
        }
    </script>
    <style>
        @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .text-gradient {
            background: linear-gradient(45deg, #60a5fa, #a855f7, #ec4899);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient 3s ease-in-out infinite;
        }
    </style>
</head>
<body class="bg-black text-white min-h-screen">
    <div class="relative z-10 px-3 sm:px-4">
        <!-- Hero Section -->
        <section class="min-h-screen flex items-center justify-center pt-16">
            <div class="w-full text-center">
                <div class="mb-6">
                    <!-- Badge -->
                    <div class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4 border border-white/10">
                        <span class="text-xs">🚀 Revolutionary 2025 Design</span>
                    </div>
                    
                    <!-- Main Title - Fixed for Mobile -->
                    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-snug px-2">
                        <span class="block mb-2 text-gradient">
                            Redefining
                        </span>
                        <span class="block text-gradient">
                            Lighting Experience
                        </span>
                    </h1>
                    
                    <!-- Subtitle -->
                    <p class="text-sm sm:text-base md:text-lg text-gray-300 mb-8 max-w-xs sm:max-w-sm mx-auto leading-relaxed px-4">
                        Neural network-powered intelligent lighting recommendation system
                    </p>
                    
                    <!-- Buttons -->
                    <div class="flex flex-col gap-3">
                        <button class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-105">
                            ⚡ Start AI Recommendations →
                        </button>
                        
                        <button class="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105">
                            👁 Watch Demo
                        </button>
                    </div>
                </div>

                <!-- Features Grid -->
                <div class="relative mt-12">
                    <div class="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                        <div class="grid grid-cols-3 gap-3 mb-4">
                            <div class="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-3 border border-white/10">
                                <div class="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
                                <h3 class="text-xs sm:text-sm font-semibold mb-1 text-white leading-tight">Neural Analysis</h3>
                                <p class="text-xs text-gray-400 leading-tight">Deep learning user preferences</p>
                            </div>
                            
                            <div class="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-3 border border-white/10">
                                <div class="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                                <h3 class="text-xs sm:text-sm font-semibold mb-1 text-white leading-tight">Quantum Computing</h3>
                                <p class="text-xs text-gray-400 leading-tight">Real-time lighting effects</p>
                            </div>
                            
                            <div class="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-3 border border-white/10">
                                <div class="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-green-500 to-teal-500 rounded-full"></div>
                                <h3 class="text-xs sm:text-sm font-semibold mb-1 text-white leading-tight">Matrix Optimization</h3>
                                <p class="text-xs text-gray-400 leading-tight">Multi-dimensional data</p>
                            </div>
                        </div>
                        
                        <!-- Status Bar -->
                        <div class="text-center">
                            <div class="inline-flex items-center gap-3 bg-black/20 rounded-full px-4 py-2">
                                <span class="text-xs text-gray-400">Real-time Data</span>
                                <div class="flex items-center gap-1">
                                    <div class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                    <span class="text-xs">99.2% Accuracy</span>
                                </div>
                                <div class="w-px h-3 bg-white/20"></div>
                                <div class="flex items-center gap-1">
                                    <div class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                                    <span class="text-xs">1,247 Users Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Next-Gen Technology Section -->
        <section class="py-16">
            <div class="w-full">
                <div class="text-center mb-12 px-4">
                    <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-snug text-gradient">
                        Next-Gen Lighting<br class="sm:hidden"> Technology
                    </h2>
                    <p class="text-sm sm:text-base text-gray-400 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
                        Revolutionary lighting solutions integrating AI, AR, and IoT
                    </p>
                </div>
            </div>
        </section>
    </div>
    
    <!-- Background Effects -->
    <div class="fixed inset-0 overflow-hidden -z-10">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-pink-950/20 animate-gradient"></div>
    </div>
    
    <!-- Test Info -->
    <div class="fixed bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-green-400 border border-green-400/20">
        📱 Mobile Font Fix Test v1.0
    </div>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(testHTML);
});

app.get('/test', (req, res) => {
    res.json({ 
        message: '移动端字体修复测试服务器运行中',
        timestamp: new Date().toISOString(),
        fixes: [
            '响应式字体大小 (text-3xl sm:text-4xl)',
            '改进的行高 (leading-snug)',
            '更好的移动端间距 (px-2, px-4)',
            '优化的渐变文字显示',
            '修复的文字截断问题'
        ]
    });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 移动端字体测试服务器启动成功！');
    console.log('');
    console.log('📱 手机访问地址:');
    console.log(`   http://192.168.31.98:${PORT}`);
    console.log('');
    console.log('🖥️  电脑访问地址:');
    console.log(`   http://localhost:${PORT}`);
    console.log('');
    console.log('🎯 测试重点:');
    console.log('  • "Redefining" 文字是否完整显示');
    console.log('  • 标题行高是否合适');
    console.log('  • 移动端字体大小是否合理');
    console.log('  • 渐变文字效果是否正常');
    console.log('');
    console.log('⚡ API测试: /test');
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭测试服务器...');
    server.close(() => {
        console.log('✅ 服务器已关闭');
        process.exit(0);
    });
});