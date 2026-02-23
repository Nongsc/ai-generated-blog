'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Link2,
  Settings,
  Image,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: '仪表盘', href: '/', icon: LayoutDashboard },
  { name: '文章管理', href: '/posts', icon: FileText },
  { name: '分类管理', href: '/categories', icon: FolderTree },
  { name: '标签管理', href: '/tags', icon: Tags },
  { name: '友链管理', href: '/links', icon: Link2 },
  { name: '媒体库', href: '/media', icon: Image },
  { name: '网站配置', href: '/config', icon: Settings },
  { name: '统计配置', href: '/analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? '80px' : '240px' }}
      className="fixed left-0 top-0 h-screen glass border-r border-border z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-sakura flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-foreground"
            >
              博客后台
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 rounded-full bg-primary"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-4 p-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
    </motion.aside>
  );
}
