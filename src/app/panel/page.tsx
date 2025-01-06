'use client';

import { useState } from 'react';

const translations = {
  tr: {
    comingSoon: 'Yakında...'
  },
  en: {
    comingSoon: 'Coming Soon...'
  },
  ja: {
    comingSoon: '近日公開...'
  }
};

export default function Dashboard() {
  const [language, setLanguage] = useState<'tr' | 'en' | 'ja'>('tr');
  const t = translations[language];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <h2 className="text-3xl font-semibold text-gray-400">
        {t.comingSoon}
      </h2>
    </div>
  );
} 