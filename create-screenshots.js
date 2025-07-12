// 创建简单的占位截图
const fs = require('fs');
const path = require('path');

const screenshotsDir = '/Users/macbookpro/Documents/claude编码/claude练手/lighting-app/public/screenshots';

// 宽屏截图 (1280x720)
const wideScreenshot = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e293b"/>
      <stop offset="100%" style="stop-color:#334155"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bgGrad)"/>
  <text x="640" y="300" text-anchor="middle" fill="#ffffff" font-size="48" font-family="sans-serif">LightingPro</text>
  <text x="640" y="360" text-anchor="middle" fill="#94a3b8" font-size="24" font-family="sans-serif">AI-Powered Lighting Recommendations</text>
  <rect x="440" y="400" width="400" height="60" fill="#3b82f6" rx="30"/>
  <text x="640" y="440" text-anchor="middle" fill="#ffffff" font-size="20" font-family="sans-serif">Start Recommendations</text>
</svg>`;

// 手机截图 (375x667)
const mobileScreenshot = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 667" width="375" height="667">
  <defs>
    <linearGradient id="mobileBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e293b"/>
      <stop offset="100%" style="stop-color:#334155"/>
    </linearGradient>
  </defs>
  <rect width="375" height="667" fill="url(#mobileBgGrad)"/>
  <text x="187.5" y="200" text-anchor="middle" fill="#ffffff" font-size="28" font-family="sans-serif">LightingPro</text>
  <text x="187.5" y="240" text-anchor="middle" fill="#94a3b8" font-size="16" font-family="sans-serif">Mobile Experience</text>
  <rect x="87.5" y="300" width="200" height="50" fill="#3b82f6" rx="25"/>
  <text x="187.5" y="330" text-anchor="middle" fill="#ffffff" font-size="16" font-family="sans-serif">Get Started</text>
</svg>`;

// 写入文件
fs.writeFileSync(path.join(screenshotsDir, 'home.svg'), wideScreenshot);
fs.writeFileSync(path.join(screenshotsDir, 'mobile-home.svg'), mobileScreenshot);

console.log('✅ 创建了占位截图');
console.log('📁 文件: home.svg, mobile-home.svg');