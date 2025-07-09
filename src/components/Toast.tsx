'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastMessage {
  type: 'success' | 'error' | 'info'
  message: string
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleShowToast = (event: CustomEvent<ToastMessage>) => {
      setToast(event.detail)
      setTimeout(() => setToast(null), 4000) // 4秒后自动消失
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('show-toast', handleShowToast as EventListener)
      return () => {
        window.removeEventListener('show-toast', handleShowToast as EventListener)
      }
    }
  }, [])

  return (
    <>
      {children}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border max-w-sm',
            toast.type === 'success' && 'bg-green-50 border-green-200 text-green-800',
            toast.type === 'error' && 'bg-red-50 border-red-200 text-red-800',
            toast.type === 'info' && 'bg-blue-50 border-blue-200 text-blue-800'
          )}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}