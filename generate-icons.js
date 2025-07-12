// 生成PWA图标的简单脚本
const fs = require('fs');
const path = require('path');

// 创建SVG图标内容 - LightingPro主题
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#a855f7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="30%" r="60%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:0.8" />
      <stop offset="70%" style="stop-color:#f59e0b;stop-opacity:0.4" />
      <stop offset="100%" style="stop-color:#d97706;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- 背景圆形 -->
  <circle cx="256" cy="256" r="240" fill="url(#grad1)" stroke="#ffffff" stroke-width="8"/>
  
  <!-- 灯泡主体 -->
  <path d="M256 120c-44.18 0-80 35.82-80 80 0 28.67 15.18 53.83 38 68.14V320c0 17.67 14.33 32 32 32h20c17.67 0 32-14.33 32-32v-51.86c22.82-14.31 38-39.47 38-68.14 0-44.18-35.82-80-80-80z" fill="#ffffff" opacity="0.95"/>
  
  <!-- 灯泡发光效果 -->
  <ellipse cx="256" cy="180" rx="50" ry="70" fill="url(#glow)"/>
  
  <!-- 螺纹细节 -->
  <rect x="226" y="320" width="60" height="8" fill="#e5e7eb" rx="4"/>
  <rect x="226" y="335" width="60" height="8" fill="#e5e7eb" rx="4"/>
  
  <!-- 底座 -->
  <rect x="236" y="352" width="40" height="20" fill="#9ca3af" rx="10"/>
  
  <!-- 高光 -->
  <ellipse cx="230" cy="160" rx="12" ry="18" fill="#ffffff" opacity="0.7"/>
</svg>`;

// 尺寸列表
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// 创建基础SVG文件
const iconsDir = '/Users/macbookpro/Documents/claude编码/claude练手/lighting-app/public/icons';
fs.writeFileSync(path.join(iconsDir, 'icon-base.svg'), svgIcon);

// 创建不同尺寸的SVG文件（用作PNG的替代）
sizes.forEach(size => {
  const scaledSvg = svgIcon.replace('viewBox="0 0 512 512"', `viewBox="0 0 512 512" width="${size}" height="${size}"`);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), scaledSvg);
});

console.log('✅ 生成了基础图标文件');
console.log('📁 位置:', iconsDir);
console.log('📏 尺寸:', sizes.map(s => `${s}x${s}`).join(', '));