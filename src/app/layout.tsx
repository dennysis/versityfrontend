import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Versity - Volunteer Opportunity Matching Platform",
  description: "Connect volunteers with meaningful opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Button } from '@/components/ui/button';

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const navItems = [
//     { name: 'Dashboard', path: '/admin/dashboard' },
//     { name: 'Users', path: '/admin/users' },
//     { name: 'Organizations', path: '/admin/organizations' },
//     { name: 'Opportunities', path: '/admin/opportunities' },
//     { name: 'Reports', path: '/admin/reports' },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className={`bg-white h-full shadow-md ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
//         <div className="p-4 flex justify-between items-center">
//           <h2 className={`font-bold text-xl ${sidebarOpen ? 'block' : 'hidden'}`}>Admin Panel</h2>
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-1"
//           >
//             {sidebarOpen ? '←' : '→'}
//           </Button>
//         </div>
//         <nav className="mt-6">
//           {navItems.map((item) => (
//             <Link 
//               key={item.path} 
//               href={item.path}
//               className={`
//                 flex items-center py-3 px-4 my-1 mx-2 rounded-md
//                 ${pathname === item.path ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
//               `}
//             >
//               <span className={sidebarOpen ? 'block' : 'hidden'}>{item.name}</span>
//               {!sidebarOpen && (
//                 <span className="text-sm">{item.name.charAt(0)}</span>
//               )}
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 overflow-auto">
//         {children}
//       </div>
//     </div>
//   );
// }
