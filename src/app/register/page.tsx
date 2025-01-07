'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';

const translations = {
  tr: {
    title: 'Kayıt Ol',
    backToHome: 'Ana Sayfaya Dön',
    email: 'E-posta',
    password: 'Şifre',
    firstName: 'Ad',
    lastName: 'Soyad',
    register: 'Kayıt Ol',
    emailPlaceholder: 'ornek@email.com',
    passwordPlaceholder: 'Şifrenizi girin',
    firstNamePlaceholder: 'Adınız',
    lastNamePlaceholder: 'Soyadınız',
    errors: {
      required: 'Bu alan zorunludur',
      invalidEmail: 'Geçerli bir e-posta adresi girin',
      userExists: 'Bu e-posta adresi zaten kayıtlı',
      serverError: 'Bir hata oluştu, lütfen tekrar deneyin'
    },
    success: 'Kayıt başarılı! Yönlendiriliyorsunuz...',
    haveAccount: 'Zaten hesabın var mı?',
    login: 'Giriş Yap'
  },
  en: {
    title: 'Register',
    backToHome: 'Back to Home',
    email: 'Email',
    password: 'Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    register: 'Register',
    emailPlaceholder: 'example@email.com',
    passwordPlaceholder: 'Enter your password',
    firstNamePlaceholder: 'Your first name',
    lastNamePlaceholder: 'Your last name',
    errors: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email',
      userExists: 'This email is already registered',
      serverError: 'An error occurred, please try again'
    },
    success: 'Registration successful! Redirecting...',
    haveAccount: 'Already have an account?',
    login: 'Login'
  },
  ja: {
    title: '登録',
    backToHome: 'ホームに戻る',
    email: 'メールアドレス',
    password: 'パスワード',
    firstName: '名',
    lastName: '姓',
    register: '登録',
    emailPlaceholder: 'example@email.com',
    passwordPlaceholder: 'パスワードを入力',
    firstNamePlaceholder: '名を入力',
    lastNamePlaceholder: '姓を入力',
    errors: {
      required: 'この項目は必須です',
      invalidEmail: '有効なメールアドレスを入力してください',
      userExists: 'このメールアドレスは既に登録されています',
      serverError: 'エラーが発生しました。もう一度お試しください'
    },
    success: '登録が完了しました！リダイレクトしています...',
    haveAccount: 'すでにアカウントをお持ちですか？',
    login: 'ログイン'
  }
};

interface LanguageButtonProps {
  currentLang: 'tr' | 'en' | 'ja';
  onLanguageChange: (lang: 'tr' | 'en' | 'ja') => void;
}

interface LanguageOption {
  code: 'tr' | 'en' | 'ja';
  flag: string;
  name: string;
}

const languages: LanguageOption[] = [
  {
    code: 'tr',
    flag: '🇹🇷',
    name: 'Türkçe'
  },
  {
    code: 'en',
    flag: '🇬🇧',
    name: 'English'
  },
  {
    code: 'ja',
    flag: '🇯🇵',
    name: '日本語'
  }
];

function LanguageButton({ currentLang, onLanguageChange }: LanguageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = languages.find(lang => lang.code === currentLang);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium border border-gray-200 shadow-sm text-sm"
      >
        <span className="w-5 h-5 flex items-center justify-center">
          {currentLanguage?.flag}
        </span>
        <span>{currentLanguage?.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 bg-white rounded-lg shadow-xl border border-gray-200 w-48">
          <div className="flex flex-col">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                  currentLang === language.code ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {language.flag}
                </span>
                <span>{language.name}</span>
                {currentLang === language.code && (
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Register() {
  const [language, setLanguage] = useState<'tr' | 'en' | 'ja'>('tr');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const t = translations[language];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
      
      // Redirect to home page after successful registration
      setTimeout(() => {
        window.location.href = '/';
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {t.title}
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
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {t.title}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                {t.firstName}
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t.firstNamePlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                {t.lastName}
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t.lastNamePlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 font-medium"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
                {t.success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? '...' : t.register}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <div className="text-sm text-gray-600">
              {t.haveAccount}{' '}
              <Link 
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
              >
                {t.login}
              </Link>
            </div>
            <div>
              <Link 
                href="/"
                className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
              >
                {t.backToHome}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 