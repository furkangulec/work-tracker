export interface LanguageButtonProps {
  currentLang: 'tr' | 'en' | 'ja';
  onLanguageChange: (lang: 'tr' | 'en' | 'ja') => void;
}

export interface LanguageOption {
  code: 'tr' | 'en' | 'ja';
  flag: string;
  name: string;
} 