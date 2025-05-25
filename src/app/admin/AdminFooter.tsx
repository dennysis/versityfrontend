'use client';

import Link from 'next/link';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Versity Admin Portal. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
              Dashboard
            </Link>
            <Link href="/help" className="text-sm text-gray-500 hover:text-gray-700">
              Help Center
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}