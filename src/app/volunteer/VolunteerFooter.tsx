"use client";

import Link from 'next/link';

const VolunteerFooter = () => {
  const footerLinks = [
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
    { name: 'About', href: '/about' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center text-gray-500 dark:text-gray-400">
              &copy; {currentYear} Versity. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default VolunteerFooter;
