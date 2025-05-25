'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';

export default function AdminLayout({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminSidebar />
      
      <div className="lg:ml-20 xl:ml-64 flex-1 flex flex-col min-h-screen">
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {pathname === '/admin/dashboard' && 'Dashboard'}
              {pathname === '/admin/users' && 'User Management'}
              {pathname === '/admin/organizations' && 'Organization Management'}
              {pathname === '/admin/opportunities' && 'Opportunity Management'}
              {pathname === '/admin/reports' && 'Reports'}
              {pathname.startsWith('/admin/users/') && 'User Details'}
              {pathname.startsWith('/admin/organizations/') && 'Organization Details'}
              {pathname.startsWith('/admin/opportunities/') && 'Opportunity Details'}
            </h1>
          </div>
          
          {children}
        </main>
        
        <AdminFooter />
      </div>
    </div>
  );
}