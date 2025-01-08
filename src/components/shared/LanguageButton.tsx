import { useState, useEffect, useRef } from 'react';
import { LanguageButtonProps, LanguageOption } from './types';

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

export function LanguageButton({ currentLang, onLanguageChange }: LanguageButtonProps) {
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