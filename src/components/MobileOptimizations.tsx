'use client';

import { useState, useEffect, useCallback } from 'react';
import { Wifi, WifiOff, Battery, Signal } from 'lucide-react';

// 🔋 移动端电池和网络状态检测
export const useMobileOptimization = () => {
  const [battery, setBattery] = useState<{ level: number; charging: boolean } | null>(null);
  const [networkInfo, setNetworkInfo] = useState<{ effectiveType: string; downlink: number } | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [deviceMotion, setDeviceMotion] = useState({ enabled: false, data: null });

  useEffect(() => {
    // 电池状态监测
    const getBatteryInfo = async () => {
      if ('getBattery' in navigator) {
        try {
          const batteryInfo = await (navigator as any).getBattery();
          setBattery({
            level: batteryInfo.level,
            charging: batteryInfo.charging
          });

          const updateBattery = () => {
            setBattery({
              level: batteryInfo.level,
              charging: batteryInfo.charging
            });
          };

          batteryInfo.addEventListener('chargingchange', updateBattery);
          batteryInfo.addEventListener('levelchange', updateBattery);

          return () => {
            batteryInfo.removeEventListener('chargingchange', updateBattery);
            batteryInfo.removeEventListener('levelchange', updateBattery);
          };
        } catch (error) {
          console.log('Battery API not supported');
        }
      }
    };

    // 网络状态监测
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink
        });
      }
    };

    // 在线状态监测
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    getBatteryInfo();
    updateNetworkInfo();
    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  const requestDeviceMotion = useCallback(async () => {
    if ('DeviceMotionEvent' in window) {
      try {
        if ((DeviceMotionEvent as any).requestPermission) {
          const permission = await (DeviceMotionEvent as any).requestPermission();
          if (permission === 'granted') {
            setDeviceMotion({ enabled: true, data: null });
          }
        } else {
          setDeviceMotion({ enabled: true, data: null });
        }
      } catch (error) {
        console.log('Device motion not supported');
      }
    }
  }, []);

  // 自适应性能模式
  const getPerformanceMode = useCallback(() => {
    const lowBattery = battery && battery.level < 0.2 && !battery.charging;
    const slowNetwork = networkInfo && networkInfo.effectiveType === 'slow-2g';
    
    if (lowBattery || slowNetwork || !isOnline) {
      return 'low-power';
    }
    return 'normal';
  }, [battery, networkInfo, isOnline]);

  return {
    battery,
    networkInfo,
    isOnline,
    deviceMotion,
    requestDeviceMotion,
    performanceMode: getPerformanceMode()
  };
};

// 🚀 移动端性能监控组件
export const MobilePerformanceMonitor = () => {
  const { battery, networkInfo, isOnline, performanceMode } = useMobileOptimization();
  const [showMonitor, setShowMonitor] = useState(false);

  const getNetworkIcon = () => {
    if (!isOnline) return <WifiOff className="w-3 h-3 text-red-400" />;
    if (networkInfo?.effectiveType === '4g' || networkInfo?.effectiveType === '5g') {
      return <Signal className="w-3 h-3 text-green-400" />;
    }
    return <Wifi className="w-3 h-3 text-yellow-400" />;
  };

  const getBatteryColor = () => {
    if (!battery) return 'text-gray-400';
    if (battery.level > 0.5) return 'text-green-400';
    if (battery.level > 0.2) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!showMonitor) {
    return (
      <button
        onClick={() => setShowMonitor(true)}
        className="fixed top-4 right-4 z-50 bg-black/20 backdrop-blur-sm rounded-full p-2 border border-white/10"
      >
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/20 backdrop-blur-xl rounded-xl p-3 border border-white/10 text-white text-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">Performance</span>
        <button
          onClick={() => setShowMonitor(false)}
          className="text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-1">
        {/* 网络状态 */}
        <div className="flex items-center gap-2">
          {getNetworkIcon()}
          <span className="text-white/80">
            {isOnline ? (networkInfo?.effectiveType || 'Unknown') : 'Offline'}
          </span>
        </div>

        {/* 电池状态 */}
        {battery && (
          <div className="flex items-center gap-2">
            <Battery className={`w-3 h-3 ${getBatteryColor()}`} />
            <span className="text-white/80">
              {Math.round(battery.level * 100)}% {battery.charging && '⚡'}
            </span>
          </div>
        )}

        {/* 性能模式 */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            performanceMode === 'low-power' ? 'bg-orange-400' : 'bg-green-400'
          }`} />
          <span className="text-white/80 capitalize">{performanceMode}</span>
        </div>
      </div>
    </div>
  );
};

// 🎯 移动端触摸优化组件
export const TouchOptimizedButton = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'medium'
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = 'relative overflow-hidden transition-all duration-200 rounded-xl font-semibold flex items-center justify-center gap-2 select-none';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg',
    secondary: 'bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white',
    ghost: 'hover:bg-white/10 text-white'
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm min-h-[2.5rem]',
    medium: 'px-6 py-3 text-base min-h-[3rem]',
    large: 'px-8 py-4 text-lg min-h-[3.5rem]'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        isPressed ? 'scale-95' : 'hover:scale-105'
      }`}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
      {/* 触摸反馈波纹效果 */}
      {isPressed && (
        <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping" />
      )}
      {children}
    </button>
  );
};

// 📱 移动端输入优化组件
export const MobileOptimizedInput = ({
  placeholder,
  value,
  onChange,
  type = 'text',
  className = ''
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/60 transition-all duration-200 min-h-[3rem] text-base ${
          isFocused 
            ? 'border-blue-400 bg-white/20 shadow-lg shadow-blue-400/20' 
            : 'border-white/20 hover:border-white/40'
        }`}
        placeholder={placeholder}
      />
      {isFocused && (
        <div className="absolute inset-0 rounded-xl border-2 border-blue-400 pointer-events-none animate-pulse" />
      )}
    </div>
  );
};

// 🎨 移动端手势控制组件
export const MobileGestureArea = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown 
}: {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
    if (isRightSwipe && onSwipeRight) onSwipeRight();
    if (isUpSwipe && onSwipeUp) onSwipeUp();
    if (isDownSwipe && onSwipeDown) onSwipeDown();
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
      className="w-full h-full"
    >
      {children}
    </div>
  );
};

// 📊 移动端懒加载图片组件
export const MobileLazyImage = ({
  src,
  alt,
  placeholder,
  className = '',
  ...props
}: {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imgRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef);
    return () => observer.disconnect();
  }, [imgRef]);

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      <img
        ref={setImgRef}
        src={isInView ? src : placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4='}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-400 rounded-full animate-bounce" />
        </div>
      )}
    </div>
  );
};

export default {
  useMobileOptimization,
  MobilePerformanceMonitor,
  TouchOptimizedButton,
  MobileOptimizedInput,
  MobileGestureArea,
  MobileLazyImage
};