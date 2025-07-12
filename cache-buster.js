// 缓存破坏器 - 强制Netlify重新部署
const timestamp = new Date().toISOString();
console.log(`🔥 强制缓存刷新: ${timestamp}`);

// 添加独特的构建标识
export const BUILD_ID = `${Date.now()}_quantum_fix`;
export const FORCE_REFRESH = true;