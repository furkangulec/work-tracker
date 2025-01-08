export interface LanguageButtonProps {
  currentLang: 'tr' | 'en' | 'ja';
  onLanguageChange: (lang: 'tr' | 'en' | 'ja') => void;
}

export interface LanguageOption {
  code: 'tr' | 'en' | 'ja';
  flag: string;
  name: string;
}

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string;
  success: boolean;
} 