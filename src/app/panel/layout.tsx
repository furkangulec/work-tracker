'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const translations = {
  tr: {
    menu: {
      dashboard: 'Panel',
    },
    title: 'Kullanıcı Paneli'
  },
  en: {
    menu: {
      dashboard: 'Dashboard',
    },
    title: 'User Panel'
  },
  ja: {
    menu: {
      dashboard: 'ダッシュボード',
    },
    title: 'ユーザーパネル'
  }
};

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<'tr' | 'en' | 'ja'>('tr');
  const pathname = usePathname();
  const t = translations[language];

  const menuItems = [
    {
      href: '/panel',
      label: t.menu.dashboard,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">{t.title}</h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 