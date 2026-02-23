'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // 检查认证状态
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
        
        if (!data.authenticated && pathname !== '/login') {
          router.replace('/login');
        }
      } catch {
        setIsAuthenticated(false);
        if (pathname !== '/login') {
          router.replace('/login');
        }
      }
    };

    checkAuth();
  }, [router, pathname]);

  // 加载中
  if (isAuthenticated === null && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
