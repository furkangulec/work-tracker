'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from './translations';
import { LanguageButton } from '@/components/shared/LanguageButton';
import { LoginForm } from './components/LoginForm';
import { Footer } from '@/components/shared/Footer';

export default function Login() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const t = translations[language];

  const handleSubmit = async (email: string, password: string) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Invalid credentials') {
          setError(t.errors.invalidCredentials);
        } else {
          setError(t.errors.serverError);
        }
        return;
      }

      setSuccess(true);
      
      // Redirect after successful login
      setTimeout(() => {
        router.push('/');
      }, 1000);

    } catch {
      setError(t.errors.serverError);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>
              Chronos
            </h1>
            <div>
              <LanguageButton
                currentLang={language}
                onLanguageChange={setLanguage}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4 flex flex-col items-center flex-grow relative z-10">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            success={success}
          />

          <div className="mt-6 text-center">
            <span className="text-gray-600">{t.noAccount}</span>
            <button
              onClick={() => router.push('/register')}
              className="ml-2 text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {t.register}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 