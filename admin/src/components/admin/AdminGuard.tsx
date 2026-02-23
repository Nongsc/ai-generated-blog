'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useSWR from 'swr';

interface SessionData {
  isLoggedIn: boolean;
  userId?: number;
  username?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const { data, error, isLoading } = useSWR<{
    success: boolean;
    data: SessionData;
  }>('/api/auth/session', fetcher, {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      const isLoggedIn = data?.data?.isLoggedIn;

      if (!isLoggedIn && pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [mounted, isLoading, data, pathname, router]);

  // Don't render anything while checking authentication
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If on login page and not logged in, show login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // If not logged in, don't render children
  if (!data?.data?.isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
