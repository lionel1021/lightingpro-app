#!/usr/bin/env node

const { exec } = require('child_process');
const open = require('open');

console.log('🚀 启动移动端字体修复测试...');

// 启动开发服务器
const server = exec('npm run dev -- --port 9999', (error, stdout, stderr) => {
  if (error) {
    console.error(`启动错误: ${error}`);
    return;
  }
});

server.stdout.on('data', (data) => {
  console.log(data);
  
  // 检测服务器启动完成
  if (data.includes('Ready') || data.includes('started server')) {
    console.log('\n✅ 服务器启动完成！');
    console.log('🌐 移动端测试地址: http://localhost:9999');
    console.log('📱 请在手机浏览器中访问测试字体修复效果');
    console.log('\n🎯 主要修复内容:');
    console.log('  • 响应式字体大小 (text-3xl sm:text-4xl)');
    console.log('  • 改进的行高 (leading-snug)');
    console.log('  • 更好的移动端间距 (px-2, px-4)');
    console.log('  • 优化的渐变文字显示');
    console.log('  • 增强的Critical CSS支持');
    
    // 自动打开浏览器（桌面测试）
    setTimeout(() => {
      console.log('\n🖥️  在桌面浏览器中打开进行预览...');
      open('http://localhost:9999');
    }, 2000);
  }
});

server.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

// 处理退出
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭服务器...');
  server.kill('SIGINT');
  process.exit(0);
});