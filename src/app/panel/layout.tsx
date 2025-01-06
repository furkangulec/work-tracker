'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  tr: {
    menu: {
      dashboard: 'Panel',
      myWorks: 'Çalışmalarım'
    },
    title: 'Kullanıcı Paneli',
    returnToWork: 'Çalışmaya Dön'
  },
  en: {
    menu: {
      dashboard: 'Dashboard',
      myWorks: 'My Works'
    },
    title: 'User Panel',
    returnToWork: 'Return to Work'
  },
  ja: {
    menu: {
      dashboard: 'ダッシュボード',
      myWorks: '作業履歴'
    },
    title: 'ユーザーパネル',
    returnToWork: '作業に戻る'
  }
};

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
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
    {
      href: '/panel/works',
      label: t.menu.myWorks,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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
          
          {/* Language Selector */}
          <div className="px-4 py-3 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {language === 'tr' ? 'Dil Seçimi' : language === 'en' ? 'Language' : '言語'}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'tr' | 'en' | 'ja')}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base font-medium text-black"
            >
              <option value="tr" className="text-base font-medium text-black">🇹🇷 Türkçe</option>
              <option value="en" className="text-base font-medium text-black">🇬🇧 English</option>
              <option value="ja" className="text-base font-medium text-black">🇯🇵 日本語</option>
            </select>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 mb-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">{t.returnToWork}</span>
            </Link>
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
      <div className="flex h-screen bg-gray-100 pl-64">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 