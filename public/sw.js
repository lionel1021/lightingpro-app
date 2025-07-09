// Service Worker for LightingPro PWA
const CACHE_NAME = 'lightingpro-v1.0.0'
const STATIC_CACHE = 'lightingpro-static-v1'
const DYNAMIC_CACHE = 'lightingpro-dynamic-v1'
const IMAGE_CACHE = 'lightingpro-images-v1'

// 静态资源缓存列表
const STATIC_ASSETS = [
  '/',
  '/questionnaire',
  '/search',
  '/manifest.json',
  '/favicon.ico',
  // 关键 CSS 和 JS 会自动缓存
]

// 图片缓存配置
const IMAGE_CACHE_CONFIG = {
  maxEntries: 50,
  maxAgeSeconds: 30 * 24 * 60 * 60, // 30天
}

// 动态缓存配置
const DYNAMIC_CACHE_CONFIG = {
  maxEntries: 100,
  maxAgeSeconds: 7 * 24 * 60 * 60, // 7天
}

// 安装事件
self.addEventListener('install', (event) => {
  console.log('SW: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('SW: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('SW: Installation complete')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('SW: Installation failed', error)
      })
  )
})

// 激活事件
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(cacheName)) {
              console.log('SW: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('SW: Activation complete')
        return self.clients.claim()
      })
      .catch((error) => {
        console.error('SW: Activation failed', error)
      })
  )
})

// 网络请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // 只处理同源请求
  if (url.origin !== location.origin) {
    return
  }
  
  // 图片请求处理
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request))
    return
  }
  
  // API 请求处理
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }
  
  // 页面请求处理
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request))
    return
  }
  
  // 静态资源处理
  event.respondWith(handleStaticRequest(request))
})

// 处理图片请求
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE)
    const cached = await cache.match(request)
    
    if (cached) {
      console.log('SW: Serving cached image:', request.url)
      return cached
    }
    
    const response = await fetch(request)
    
    if (response.ok) {
      // 缓存新图片
      await cache.put(request, response.clone())
      await cleanupCache(IMAGE_CACHE, IMAGE_CACHE_CONFIG)
    }
    
    return response
  } catch (error) {
    console.error('SW: Image request failed:', error)
    // 返回占位符图片
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="#9ca3af">Image not available</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    )
  }
}

// 处理 API 请求
async function handleApiRequest(request) {
  try {
    // 对于 API 请求，优先使用网络
    const response = await fetch(request)
    
    // 缓存成功的 GET 请求
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE)
      await cache.put(request, response.clone())
      await cleanupCache(DYNAMIC_CACHE, DYNAMIC_CACHE_CONFIG)
    }
    
    return response
  } catch (error) {
    console.error('SW: API request failed:', error)
    
    // 网络失败时尝试从缓存返回
    if (request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE)
      const cached = await cache.match(request)
      
      if (cached) {
        console.log('SW: Serving cached API response:', request.url)
        return cached
      }
    }
    
    // 返回离线响应
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This content is not available offline'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// 处理页面导航请求
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      // 缓存页面
      const cache = await caches.open(DYNAMIC_CACHE)
      await cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.error('SW: Navigation request failed:', error)
    
    // 尝试从缓存返回页面
    const cache = await caches.open(DYNAMIC_CACHE)
    const cached = await cache.match(request)
    
    if (cached) {
      console.log('SW: Serving cached page:', request.url)
      return cached
    }
    
    // 返回离线页面
    return caches.match('/')
  }
}

// 处理静态资源请求
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE)
    const cached = await cache.match(request)
    
    if (cached) {
      return cached
    }
    
    const response = await fetch(request)
    
    if (response.ok) {
      await cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.error('SW: Static request failed:', error)
    throw error
  }
}

// 清理缓存
async function cleanupCache(cacheName, config) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  
  if (keys.length > config.maxEntries) {
    const keysToDelete = keys.slice(0, keys.length - config.maxEntries)
    await Promise.all(keysToDelete.map(key => cache.delete(key)))
  }
}

// 消息处理
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then(size => {
      event.ports[0].postMessage({ type: 'CACHE_SIZE', size })
    })
  }
})

// 获取缓存大小
async function getCacheSize() {
  const cacheNames = await caches.keys()
  let totalSize = 0
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    totalSize += keys.length
  }
  
  return totalSize
}

// 后台同步（如果支持）
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync())
    }
  })
}

async function doBackgroundSync() {
  console.log('SW: Performing background sync')
  // 这里可以执行后台数据同步
}