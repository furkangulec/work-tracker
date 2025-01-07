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
    returnToWork: 'Çalışmaya Dön',
    logout: 'Çıkış Yap'
  },
  en: {
    menu: {
      dashboard: 'Dashboard',
      myWorks: 'My Works'
    },
    title: 'User Panel',
    returnToWork: 'Return to Work',
    logout: 'Logout'
  },
  ja: {
    menu: {
      dashboard: 'ダッシュボード',
      myWorks: '作業履歴'
    },
    title: 'ユーザーパネル',
    returnToWork: '作業に戻る',
    logout: 'ログアウト'
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

  const handleLogout = async () => {
    try {
      // Send logout request to clear token on server
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies in request
      });
      
      if (response.ok) {
        // Clear any client-side storage if exists
        localStorage.removeItem('timerState');
        
        // Redirect to homepage
        window.location.href = '/';
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

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
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header Title */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
              Chronos
            </h1>
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

          <div className="flex-1 px-4 py-4 space-y-1">
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
          </div>
          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">{t.logout}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {children}
      </div>
    </div>
  );
} 