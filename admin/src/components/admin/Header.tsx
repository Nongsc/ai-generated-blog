'use client';

import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { LogOut, User, Bell } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Header() {
  const router = useRouter();
  const { data } = useSWR('/api/auth/session', fetcher);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="fixed top-0 right-0 left-0 h-16 glass border-b border-border z-30 flex items-center justify-end px-6 gap-4" style={{ marginLeft: '240px' }}>
      {/* Notifications */}
      <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
        <Bell className="w-5 h-5 text-muted-foreground" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
      </button>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {data?.data?.username || '管理员'}
          </p>
          <p className="text-xs text-muted-foreground">系统管理员</p>
        </div>
        <div className="w-10 h-10 rounded-full gradient-sakura flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="p-2 rounded-lg hover:bg-muted transition-colors group"
        title="退出登录"
      >
        <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
      </button>
    </header>
  );
}
