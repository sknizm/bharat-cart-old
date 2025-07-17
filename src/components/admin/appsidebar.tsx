"use client";
import { Inbox, Group, Receipt, Layout, DollarSign, Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LogoutButton from '../ui/logout';

const items = [
  {
    id: 1,
    title: "Overview",
    url: "/adminboard/overview",
    icon: Inbox,
  },
  {
    id: 2,
    title: "Users",
    url: "/adminboard/users",
    icon: Group,
  },
  {
    id: 3,
    title: "Memberships",
    url: "/adminboard/memberships",
    icon: Receipt,
  },
  {
    id: 4,
    title: "Restaurants",
    url: "/adminboard/resturants",
    icon: Layout,
  },
  {
    id: 5,
    title: "Payments",
    url: "/adminboard/payments",
    icon: DollarSign,
  },
  {
    id: 6,
    title: "Notifications",
    url: "/adminboard/notifications",
    icon: Inbox,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed z-50 top-4 left-4 p-2 rounded-md bg-gray-800 text-white md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 w-64 bg-gray-800 text-white flex flex-col min-h-screen p-4 transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="mb-8 px-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          {isMobile && (
            <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-700">
              <X size={20} />
            </button>
          )}
        </div>
        
        <nav className="flex-1 space-y-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              onClick={() => isMobile && setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors
                ${pathname === item.url
                  ? 'bg-indigo-700 text-white'
                  : 'hover:bg-gray-700 text-gray-300'}`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-700 pt-4">
          <div className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
          <LogoutButton/>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}