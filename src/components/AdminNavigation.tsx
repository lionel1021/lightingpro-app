'use client';

/**
 * 🎛️ 管理员导航组件 - 统一的管理界面导航
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Package,
  BarChart3,
  Users,
  Settings,
  ShoppingBag,
  TrendingUp,
  FileText,
  Bell,
  LogOut
} from 'lucide-react';

const navigationItems = [
  {
    name: '仪表板',
    href: '/admin',
    icon: LayoutDashboard,
    description: '总览数据'
  },
  {
    name: '产品管理',
    href: '/admin/products',
    icon: Package,
    description: '管理产品库'
  },
  {
    name: '数据分析',
    href: '/admin/analytics',
    icon: BarChart3,
    description: '数据洞察'
  },
  {
    name: '用户管理',
    href: '/admin/users',
    icon: Users,
    description: '用户数据'
  },
  {
    name: '订单管理',
    href: '/admin/orders',
    icon: ShoppingBag,
    description: '订单处理'
  },
  {
    name: '推荐优化',
    href: '/admin/recommendations',
    icon: TrendingUp,
    description: 'AI推荐'
  },
  {
    name: '内容管理',
    href: '/admin/content',
    icon: FileText,
    description: '内容编辑'
  },
  {
    name: '系统设置',
    href: '/admin/settings',
    icon: Settings,
    description: '系统配置'
  }
];

interface AdminNavigationProps {
  className?: string;
}

export default function AdminNavigation({ className = '' }: AdminNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={`bg-white shadow-sm border-r border-gray-200 ${className}`}>
      <div className="px-4 py-6">
        {/* Logo区域 */}
        <div className="flex items-center mb-8">
          <div className="p-2 bg-blue-600 rounded-lg mr-3">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">LightingPro</h1>
            <p className="text-sm text-gray-500">管理控制台</p>
          </div>
        </div>

        {/* 导航菜单 */}
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
                {isActive && (
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* 底部操作 */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-xs font-medium text-blue-600">Admin</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">管理员</div>
                <div className="text-xs text-gray-500">admin@lightingpro.com</div>
              </div>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Bell className="h-4 w-4" />
            </button>
          </div>
          
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
            <LogOut className="h-4 w-4 mr-3" />
            退出登录
          </button>
        </div>
      </div>
    </nav>
  );
}

// 管理员页面布局包装器
interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminLayout({ children, title, description, actions }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <div className="w-64 flex-shrink-0">
        <AdminNavigation className="h-full" />
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 页面头部 */}
        {(title || actions) && (
          <div className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-gray-500">{description}</p>
                  )}
                </div>
                {actions && <div className="flex items-center space-x-4">{actions}</div>}
              </div>
            </div>
          </div>
        )}

        {/* 页面内容 */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}