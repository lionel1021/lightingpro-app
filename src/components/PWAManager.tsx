'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Download, Wifi, WifiOff } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [showOfflineBanner, setShowOfflineBanner] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // 检查是否已安装
    const checkIfInstalled = () => {
      if (typeof window !== 'undefined') {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        const isInWebAppiOS = (window.navigator as any).standalone === true
        setIsInstalled(isStandalone || isInWebAppiOS)
      }
    }

    // 监听安装提示事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const event = e as BeforeInstallPromptEvent
      setDeferredPrompt(event)
      setIsInstallable(true)
      
      // 延迟显示安装横幅
      setTimeout(() => {
        setShowInstallBanner(true)
      }, 3000)
    }

    // 监听应用安装事件
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setShowInstallBanner(false)
      console.log('PWA: App installed successfully')
    }

    // 监听网络状态
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineBanner(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineBanner(true)
    }

    checkIfInstalled()

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 检查初始网络状态
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt')
      } else {
        console.log('PWA: User dismissed the install prompt')
      }
      
      setDeferredPrompt(null)
      setShowInstallBanner(false)
    } catch (error) {
      console.error('PWA: Install prompt failed:', error)
    }
  }

  // 注册 Service Worker
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW: Registration successful', registration.scope)
          
          // 检查更新
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // 有新版本可用
                  showUpdateAvailable()
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('SW: Registration failed:', error)
        })
    }
  }, [])

  const showUpdateAvailable = () => {
    if (confirm('New version available! Reload to update?')) {
      window.location.reload()
    }
  }

  return (
    <>
      {/* 安装横幅 */}
      {showInstallBanner && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
          <button
            onClick={() => setShowInstallBanner(false)}
            className="absolute top-2 right-2 text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-start gap-3">
            <Download className="w-5 h-5 mt-0.5 text-blue-200" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Install LightingPro</h3>
              <p className="text-xs text-blue-100 mt-1">
                Add to home screen for quick access and offline browsing
              </p>
              <Button
                onClick={handleInstallClick}
                variant="secondary"
                size="sm"
                className="mt-2 bg-white text-blue-600 hover:bg-blue-50"
              >
                Install App
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 离线横幅 */}
      {showOfflineBanner && (
        <div className="fixed top-4 left-4 right-4 bg-orange-600 text-white p-3 rounded-lg shadow-lg z-50">
          <button
            onClick={() => setShowOfflineBanner(false)}
            className="absolute top-2 right-2 text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-orange-200" />
            <div className="flex-1">
              <p className="text-sm font-medium">You're offline</p>
              <p className="text-xs text-orange-100">
                Some features may be limited. We'll sync when you're back online.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 网络状态指示器 */}
      <div className="fixed top-4 right-4 z-40">
        {!isOnline && (
          <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
            <WifiOff className="w-4 h-4" />
          </div>
        )}
      </div>
    </>
  )
}

// PWA 状态 Hook
export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkInstalled = () => {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        const isInWebAppiOS = (window.navigator as any).standalone === true
        setIsInstalled(isStandalone || isInWebAppiOS)
      }

      const handleBeforeInstallPrompt = () => {
        setCanInstall(true)
      }

      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)

      checkInstalled()
      setIsOnline(navigator.onLine)

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])

  return {
    isInstalled,
    isOnline,
    canInstall
  }
}