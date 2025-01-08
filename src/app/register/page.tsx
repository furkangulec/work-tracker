'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from './translations';
import { LanguageButton } from '@/components/shared/LanguageButton';
import { RegisterForm } from './components/RegisterForm';
import { Footer } from '@/components/shared/Footer';

export default function Register() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const t = translations[language];

  const handleSubmit = async (firstName: string, lastName: string, email: string, password: string) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'User already exists') {
          setError(t.errors.userExists);
        } else {
          setError(t.errors.serverError);
        }
        return;
      }

      setSuccess(true);
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push('/login');
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
          <RegisterForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            success={success}
          />

          <div className="mt-6 text-center space-y-4">
            <div>
              <span className="text-gray-600">{t.haveAccount}</span>
              <button
                onClick={() => router.push('/login')}
                className="ml-2 text-indigo-600 hover:text-indigo-500 font-medium"
              >
                {t.login}
              </button>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t.backToHome}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 