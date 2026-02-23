'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminLayout from './AdminLayout';

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    // 登录页不需要检查认证
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        
        if (!data.authenticated) {
          router.replace('/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        router.replace('/login');
      }
    };

    checkAuth();
  }, [isLoginPage, router]);

  // 登录页直接显示
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 加载中
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
