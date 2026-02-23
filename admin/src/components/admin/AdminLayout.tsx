'use client';

import Sidebar from './Sidebar';
import Header from './Header';
import AdminGuard from './AdminGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main className="ml-60 pt-16 p-6">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
