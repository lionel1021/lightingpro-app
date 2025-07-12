// 创建shortcuts图标
const fs = require('fs');
const path = require('path');

const iconsDir = '/Users/macbookpro/Documents/claude编码/claude练手/lighting-app/public/icons';

// 推荐图标
const recommendationsIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
  <circle cx="48" cy="48" r="44" fill="#3b82f6" stroke="#ffffff" stroke-width="4"/>
  <path d="M48 20c-8 0-14 6-14 14 0 5 2.5 9.5 6.5 12.5V56c0 3 2.5 5.5 5.5 5.5h4c3 0 5.5-2.5 5.5-5.5V46.5c4-3 6.5-7.5 6.5-12.5 0-8-6-14-14-14z" fill="#ffffff"/>
  <circle cx="48" cy="32" r="8" fill="#fbbf24" opacity="0.8"/>
</svg>`;

// 搜索图标
const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
  <circle cx="48" cy="48" r="44" fill="#10b981" stroke="#ffffff" stroke-width="4"/>
  <circle cx="40" cy="40" r="12" fill="none" stroke="#ffffff" stroke-width="3"/>
  <path d="M50 50L62 62" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
</svg>`;

// 收藏图标
const favoritesIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
  <circle cx="48" cy="48" r="44" fill="#ef4444" stroke="#ffffff" stroke-width="4"/>
  <path d="M48 68L32 52c-4-4-4-10 0-14s10-4 14 0l2 2 2-2c4-4 10-4 14 0s4 10 0 14L48 68z" fill="#ffffff"/>
</svg>`;

// 写入文件
fs.writeFileSync(path.join(iconsDir, 'shortcut-recommendations.svg'), recommendationsIcon);
fs.writeFileSync(path.join(iconsDir, 'shortcut-search.svg'), searchIcon);
fs.writeFileSync(path.join(iconsDir, 'shortcut-favorites.svg'), favoritesIcon);

console.log('✅ 创建了shortcuts图标');
console.log('📁 文件: shortcut-recommendations.svg, shortcut-search.svg, shortcut-favorites.svg');