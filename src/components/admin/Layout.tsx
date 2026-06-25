'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Code, 
  FolderOpen, 
  FileText, 
  Mail, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Hero区域', icon: Settings, href: '/admin/hero' },
  { label: '关于我', icon: User, href: '/admin/about' },
  { label: '技能管理', icon: Code, href: '/admin/skills' },
  { label: '项目管理', icon: FolderOpen, href: '/admin/projects' },
  { label: '博客管理', icon: FileText, href: '/admin/blog' },
  { label: '联系信息', icon: Mail, href: '/admin/contact' },
  { label: '统计数据', icon: BarChart3, href: '/admin/stats' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside 
        className={`fixed md:sticky left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-50 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center h-16 px-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            {sidebarOpen && (
              <span className="text-lg font-bold">管理后台</span>
            )}
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </a>
            );
          })}
        </nav>

        <div className="absolute bottom-4 w-full px-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>退出登录</span>}
          </button>
        </div>
      </aside>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 md:hidden z-50 p-2 bg-gray-900 text-white rounded-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <main className="flex-1 ml-0 md:ml-64 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
