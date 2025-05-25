'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  BarChart2,
  Users,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronLeft,  // Added this import
  Building,
  Shield
} from 'lucide-react';

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleLogout = () => {
    logout();
    // Redirect to login page
  };

  const navLinks = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: <BarChart2 className="h-5 w-5" /> 
    },
    { 
      name: 'Users', 
      href: '/admin/users', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: 'Organizations', 
      href: '/admin/organizations', 
      icon: <Building className="h-5 w-5" /> 
    },
    { 
      name: 'Opportunities', 
      href: '/admin/opportunities', 
      icon: <Briefcase className="h-5 w-5" /> 
    },
    { 
      name: 'Reports', 
      href: '/admin/reports', 
      icon: <FileText className="h-5 w-5" /> 
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-indigo-600 text-white shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobile && showMobileMenu && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleMobileMenu}>
          <div 
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between h-16 px-4 border-b">
                <Link href="/admin/dashboard" className="flex items-center">
                  <Shield className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-semibold text-gray-900">Admin</span>
                </Link>
                <button onClick={toggleMobileMenu} className="p-1 rounded-md text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`flex items-center p-2 text-base font-medium rounded-lg ${
                          pathname === link.href || pathname.startsWith(`${link.href}/`)
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        <span className="mr-3">{link.icon}</span>
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-lg font-semibold">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{user?.username || 'Admin User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:block fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className={`flex items-center h-16 px-4 border-b ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <Link href="/admin/dashboard" className="flex items-center">
                <Shield className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">Admin</span>
              </Link>
            )}
            {collapsed && (
              <Link href="/admin/dashboard" className="flex items-center justify-center">
                <Shield className="h-8 w-8 text-indigo-600" />
              </Link>
            )}
            {!collapsed && (
              <button 
                onClick={toggleSidebar} 
                className="p-1 rounded-md text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`flex items-center p-2 text-base font-medium rounded-lg ${
                      pathname === link.href || pathname.startsWith(`${link.href}/`)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? link.name : ''}
                  >
                    <span className={collapsed ? '' : 'mr-3'}>{link.icon}</span>
                    {!collapsed && <span>{link.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {!collapsed && (
            <div className="p-4 border-t">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-lg font-semibold">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.username || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                <span>Sign out</span>
              </button>
            </div>
          )}
          
          {collapsed && (
            <div className="p-4 border-t flex justify-center">
              <button 
                onClick={toggleSidebar} 
                className="p-1 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
