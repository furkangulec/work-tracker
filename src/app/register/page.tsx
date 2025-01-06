'use client';

import { useState } from 'react';
import Link from 'next/link';

const translations = {
  tr: {
    title: 'Kayıt Ol',
    backToHome: 'Ana Sayfaya Dön'
  },
  en: {
    title: 'Register',
    backToHome: 'Back to Home'
  },
  ja: {
    title: '登録',
    backToHome: 'ホームに戻る'
  }
};

export default function Register() {
  const [language] = useState<'tr' | 'en' | 'ja'>('tr');
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      {/* Squared notebook background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(#e5e7eb 1px, transparent 1px),
            linear-gradient(90deg, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          opacity: 0.2
        }}
      />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {t.title}
          </h1>

          <div className="mt-8 text-center">
            <Link 
              href="/"
              className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
            >
              {t.backToHome}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 