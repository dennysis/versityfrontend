'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { name: 'Profile', href: '/settings/profile' },
      { name: 'Account', href: '/settings/account' },
      { name: 'Notifications', href: '/settings/notifications' },
      { name: 'Display', href: '/settings/display' },
    ];

    if (user?.role === 'volunteer') {
      return [
        ...commonItems,
        { name: 'Privacy', href: '/settings/privacy' },
      ];
    }

    if (user?.role === 'organization') {
      return [
        ...commonItems,
        { name: 'Organization Profile', href: '/settings/organization' },
        { name: 'Team Members', href: '/settings/team' },
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { name: 'System Settings', href: '/settings/system' },
        { name: 'User Management', href: '/settings/users' },
      ];
    }

    return commonItems;
  };

  const navItems = getNavItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Settings Content */}
        <main className="flex-1 bg-white rounded-lg shadow p-6">
          {children}
        </main>
      </div>
    </div>
  );
}