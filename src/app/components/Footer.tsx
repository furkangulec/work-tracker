'use client';

interface FooterProps {
  language?: 'tr' | 'en' | 'ja';
}

const translations = {
  tr: {
    copyright: '© {year} Work Tracker. Tüm hakları saklıdır.'
  },
  en: {
    copyright: '© {year} Work Tracker. All rights reserved.'
  },
  ja: {
    copyright: '© {year} Work Tracker. 無断複写・転載を禁じます。'
  }
};

export default function Footer({ language = 'tr' }: FooterProps) {
  const t = translations[language];
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {t.copyright.replace('{year}', year.toString())}
      </div>
    </footer>
  );
} 