'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Footer from './components/Footer';
import { verifyJwt } from '@/lib/jwt';
import { getJwtFromCookie } from '@/lib/jwt';

// Add translations
const translations = {
  tr: {
    title: 'Çalışma Takibi',
    register: 'Kayıt Ol',
    login: 'Giriş Yap',
    promo: {
      title: 'Çalışmalarını Kaydet!',
      description: 'Kayıt olarak tüm çalışma verilerini güvenle saklayabilir, geçmiş çalışmalarını görüntüleyebilir ve detaylı istatistikler elde edebilirsin.'
    },
    welcome: {
      title: 'Hoş Geldin, {name}!',
      description: 'Çalışma verilerini otomatik olarak kaydediyoruz. İstediğin zaman geçmiş çalışmalarını görüntüleyebilirsin.',
      panel: 'Panele Git'
    },
    status: {
      working: 'Çalışıyor',
      break: 'Mola',
      notStarted: 'Henüz Başlamadı'
    },
    buttons: {
      startWork: 'Çalışmaya Başla',
      takeBreak: 'Mola Ver',
      continueWork: 'Çalışmaya Devam Et',
      finishWork: 'Çalışmayı Bitir',
      newWork: 'Yeni Çalışmaya Başla',
      report: 'Rapor',
      yes: 'Evet, Bitir',
      cancel: 'İptal'
    },
    labels: {
      totalWork: 'Toplam Çalışma',
      totalBreak: 'Toplam Mola',
      workSession: 'Çalışma',
      breakSession: 'Mola',
      start: 'Başlangıç',
      end: 'Bitiş',
      ongoing: 'Devam Ediyor',
      currentReport: 'Mevcut Rapor',
      workReport: 'Çalışma Raporu',
      detailedSessions: 'Detaylı Oturumlar'
    },
    confirmModal: {
      title: 'Çalışmayı Bitir',
      message: 'Çalışmayı bitirmek istediğinize emin misiniz? Bu işlem geri alınamaz ve mevcut çalışma oturumunuz sonlandırılacaktır.'
    }
  },
  en: {
    title: 'Work Tracker',
    register: 'Register',
    login: 'Login',
    promo: {
      title: 'Save Your Work!',
      description: 'Register to securely store all your work data, view your past work sessions, and get detailed statistics.'
    },
    welcome: {
      title: 'Welcome, {name}!',
      description: 'We\'re automatically saving your work data. You can view your past work sessions anytime.',
      panel: 'Go to Panel'
    },
    status: {
      working: 'Working',
      break: 'Break',
      notStarted: 'Not Started'
    },
    buttons: {
      startWork: 'Start Working',
      takeBreak: 'Take Break',
      continueWork: 'Continue Working',
      finishWork: 'Finish Work',
      newWork: 'Start New Work',
      report: 'Report',
      yes: 'Yes, Finish',
      cancel: 'Cancel'
    },
    labels: {
      totalWork: 'Total Work',
      totalBreak: 'Total Break',
      workSession: 'Work',
      breakSession: 'Break',
      start: 'Start',
      end: 'End',
      ongoing: 'Ongoing',
      currentReport: 'Current Report',
      workReport: 'Work Report',
      detailedSessions: 'Detailed Sessions'
    },
    confirmModal: {
      title: 'Finish Work',
      message: 'Are you sure you want to finish working? This action cannot be undone and your current work session will be ended.'
    }
  },
  ja: {
    title: '作業トラッカー',
    register: '登録',
    login: 'ログイン',
    promo: {
      title: '作業を保存しよう！',
      description: '登録して作業データを安全に保存し、過去の作業セッションを表示し、詳細な統計を取得できます。'
    },
    welcome: {
      title: 'ようこそ、{name}さん！',
      description: '作業データは自動的に保存されています。過去の作業セッションはいつでも確認できます。',
      panel: 'パネルへ'
    },
    status: {
      working: '作業中',
      break: '休憩中',
      notStarted: '未開始'
    },
    buttons: {
      startWork: '作業開始',
      takeBreak: '休憩する',
      continueWork: '作業再開',
      finishWork: '作業終了',
      newWork: '新規作業開始',
      report: 'レポート',
      yes: 'はい、終了します',
      cancel: 'キャンセル'
    },
    labels: {
      totalWork: '総作業時間',
      totalBreak: '総休憩時間',
      workSession: '作業',
      breakSession: '休憩',
      start: '開始',
      end: '終了',
      ongoing: '進行中',
      currentReport: '現在のレポート',
      workReport: '作業レポート',
      detailedSessions: '詳細セッション'
    },
    confirmModal: {
      title: '作業終了',
      message: '作業を終了してもよろしいですか？この操作は取り消せず、現在の作業セッションが終了します。'
    }
  }
};

interface WorkSession {
  startTime: number;
  endTime: number | null;
  type: 'work' | 'break';
}

interface TimerState {
  isWorking: boolean;
  isBreak: boolean;
  workTime: number;
  breakTime: number;
  lastStartTime: number | null;
  sessions: WorkSession[];
  isFinished: boolean;
  workId?: string; // MongoDB work document ID
}

const initialState: TimerState = {
  isWorking: false,
  isBreak: false,
  workTime: 0,
  breakTime: 0,
  lastStartTime: null,
  sessions: [],
  isFinished: false,
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

interface ReportModalProps {
  timerState: TimerState;
  onClose: () => void;
  formatDateTime: (timestamp: number) => string;
  t: typeof translations.tr | typeof translations.en | typeof translations.ja;
}

function ReportModal({ timerState, onClose, formatDateTime, t }: ReportModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t.labels.currentReport}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ❌
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span>⏱️</span> {t.labels.totalWork}
            </h3>
            <div className="text-3xl font-mono font-bold text-green-600">
              {new Date(timerState.workTime).toISOString().substr(11, 8)}
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span>☕</span> {t.labels.totalBreak}
            </h3>
            <div className="text-3xl font-mono font-bold text-yellow-600">
              {new Date(timerState.breakTime).toISOString().substr(11, 8)}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <span>📊</span> {t.labels.detailedSessions}
          </h3>
          <div className="space-y-4">
            {timerState.sessions.map((session, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  session.type === 'work' 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-lg text-gray-800">
                    {session.type === 'work' ? `🎯 ${t.labels.workSession}` : `☕ ${t.labels.breakSession}`} #{index + 1}
                  </div>
                  {session.endTime && (
                    <div className={`font-mono font-bold ${
                      session.type === 'work' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {new Date(session.endTime - session.startTime).toISOString().substr(11, 8)}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="space-y-1">
                    <div className="font-medium">{t.labels.start}</div>
                    <div>{formatDateTime(session.startTime)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">{t.labels.end}</div>
                    <div>{session.endTime ? formatDateTime(session.endTime) : t.labels.ongoing}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  t: typeof translations.tr | typeof translations.en | typeof translations.ja;
}

function ConfirmModal({ onConfirm, onCancel, t }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.confirmModal.title}</h2>
        <p className="text-gray-600 mb-6">
          {t.confirmModal.message}
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {t.buttons.yes}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            {t.buttons.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [timerState, setTimerState] = useState<TimerState>(initialState);
  const [displayTime, setDisplayTime] = useState('00:00:00');
  const [showReport, setShowReport] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [language, setLanguage] = useState<'tr' | 'en' | 'ja'>('tr');
  const [user, setUser] = useState<{ id: string; email: string; firstName: string; lastName: string } | null>(null);

  // Get translations for current language
  const t = translations[language];

  useEffect(() => {
    // Check if user is logged in by verifying JWT token from cookie
    async function checkAuth() {
      try {
        // Make a request to an API endpoint that can read the httpOnly cookie
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      }
    }

    checkAuth();
  }, []); // Run only once on component mount

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('timerState');
      if (savedState) {
        const parsedState = JSON.parse(savedState) as TimerState;
        // Ensure sessions array exists
        setTimerState({
          ...parsedState,
          sessions: Array.isArray(parsedState.sessions) ? parsedState.sessions : [],
        });
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
      setTimerState(initialState);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState.isWorking || timerState.isBreak) {
      interval = setInterval(() => {
        setTimerState(prev => {
          const newState = {
            ...prev,
            [timerState.isWorking ? 'workTime' : 'breakTime']: 
              prev[timerState.isWorking ? 'workTime' : 'breakTime'] + 1000,
          };
          localStorage.setItem('timerState', JSON.stringify(newState));
          return newState;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState.isWorking, timerState.isBreak]);

  useEffect(() => {
    const formatTime = (time: number) => {
      const hours = Math.floor(time / 3600000);
      const minutes = Math.floor((time % 3600000) / 60000);
      const seconds = Math.floor((time % 60000) / 1000);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    setDisplayTime(formatTime(timerState.isBreak ? timerState.breakTime : timerState.workTime));
  }, [timerState.workTime, timerState.breakTime, timerState.isBreak]);

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const startWork = async () => {
    const currentTime = Date.now();

    if (user) {
      try {
        // If there are existing sessions and the last one is a break, continue the work
        if (timerState.sessions.length > 0 && timerState.sessions[timerState.sessions.length - 1].type === 'break') {
          // Continue work by updating existing work session
          const response = await fetch('/api/work/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              workId: timerState.workId,
              action: 'continue'
            }),
          });
          const data = await response.json();

          if (!data.success) {
            throw new Error(data.error);
          }

          setTimerState(prev => ({
            ...prev,
            isWorking: true,
            isBreak: false,
            lastStartTime: currentTime,
            sessions: data.work.sessions,
          }));
        } else {
          // Check if there is an active session
          const checkResponse = await fetch('/api/work/check-active');
          const checkData = await checkResponse.json();

          if (checkData.hasActiveSession) {
            throw new Error('There is already an active work session');
          }

          // Start new work session
          const response = await fetch('/api/work/start', {
            method: 'POST',
          });
          const data = await response.json();

          if (!data.success) {
            throw new Error(data.error);
          }

          setTimerState(prev => ({
            ...prev,
            isWorking: true,
            isBreak: false,
            lastStartTime: currentTime,
            workId: data.workId,
            sessions: data.work.sessions,
            isFinished: false,
          }));
        }
      } catch (error) {
        console.error('Failed to start work:', error);
        // Show error to user
        alert(error instanceof Error ? error.message : 'Failed to start work');
        // Don't fallback to localStorage if API fails
        return;
      }
    } else {
      // Use localStorage for guests
      startWorkLocally(currentTime);
    }
  };

  const startWorkLocally = (currentTime: number) => {
    setTimerState(prev => {
      const sessions = prev.sessions || [];
      const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
      
      if (lastSession && lastSession.endTime === null) {
        lastSession.endTime = currentTime;
      }

      const newSessions = [...sessions, { startTime: currentTime, endTime: null, type: 'work' as const }];
      const newState = {
        ...prev,
        isWorking: true,
        isBreak: false,
        lastStartTime: currentTime,
        sessions: newSessions,
        isFinished: false,
      };
      localStorage.setItem('timerState', JSON.stringify(newState));
      return newState;
    });
  };

  const startBreak = async () => {
    const currentTime = Date.now();

    if (user && timerState.workId) {
      try {
        // Update work in MongoDB
        const response = await fetch('/api/work/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workId: timerState.workId,
            action: 'break'
          }),
        });
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error);
        }

        setTimerState(prev => ({
          ...prev,
          isWorking: false,
          isBreak: true,
          lastStartTime: currentTime,
          sessions: data.work.sessions,
        }));
      } catch (error) {
        console.error('Failed to start break:', error);
        // Fallback to localStorage if API fails
        startBreakLocally(currentTime);
      }
    } else {
      // Use localStorage for guests
      startBreakLocally(currentTime);
    }
  };

  const startBreakLocally = (currentTime: number) => {
    setTimerState(prev => {
      const sessions = prev.sessions || [];
      const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
      
      if (lastSession && lastSession.endTime === null) {
        lastSession.endTime = currentTime;
      }

      const newSessions = [...sessions, { startTime: currentTime, endTime: null, type: 'break' as const }];
      const newState = {
        ...prev,
        isWorking: false,
        isBreak: true,
        lastStartTime: currentTime,
        sessions: newSessions,
      };
      localStorage.setItem('timerState', JSON.stringify(newState));
      return newState;
    });
  };

  const finishWork = async () => {
    const currentTime = Date.now();

    if (user && timerState.workId) {
      try {
        // Finish work in MongoDB
        const response = await fetch('/api/work/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workId: timerState.workId,
            action: 'finish'
          }),
        });
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error);
        }

        setTimerState(prev => ({
          ...prev,
          isWorking: false,
          isBreak: false,
          lastStartTime: null,
          sessions: data.work.sessions,
          isFinished: true,
        }));
      } catch (error) {
        console.error('Failed to finish work:', error);
        // Fallback to localStorage if API fails
        finishWorkLocally(currentTime);
      }
    } else {
      // Use localStorage for guests
      finishWorkLocally(currentTime);
    }
  };

  const finishWorkLocally = (currentTime: number) => {
    setTimerState(prev => {
      const sessions = prev.sessions || [];
      const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
      
      if (lastSession && lastSession.endTime === null) {
        lastSession.endTime = currentTime;
      }

      const newState = {
        ...prev,
        isWorking: false,
        isBreak: false,
        lastStartTime: null,
        sessions: sessions,
        isFinished: true,
      };
      localStorage.setItem('timerState', JSON.stringify(newState));
      return newState;
    });
  };

  const resetTimers = () => {
    localStorage.setItem('timerState', JSON.stringify(initialState));
    setTimerState(initialState);
  };

  const handleFinishWork = () => {
    setShowConfirm(true);
  };

  const confirmFinishWork = () => {
    finishWork();
    setShowConfirm(false);
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

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 flex flex-col items-center flex-grow relative z-10">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8 w-full max-w-4xl">
          {!timerState.isFinished ? (
            <>
              <div className="text-center mb-8">
                <div className="text-6xl sm:text-8xl md:text-9xl font-mono font-bold mb-4 text-gray-900 break-all sm:break-normal">
                  {displayTime}
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base sm:text-lg font-medium ${
                  timerState.isWorking 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : timerState.isBreak 
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  <span className={`w-3 h-3 rounded-full ${
                    timerState.isWorking 
                      ? 'bg-green-500 animate-pulse' 
                      : timerState.isBreak 
                      ? 'bg-yellow-500 animate-pulse'
                      : 'bg-gray-500'
                  }`}></span>
                  {timerState.isWorking ? t.status.working : timerState.isBreak ? t.status.break : t.status.notStarted}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {!timerState.isWorking && !timerState.isBreak && (
                  <button
                    onClick={startWork}
                    className="w-full py-3 sm:py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-base sm:text-lg"
                  >
                    {t.buttons.startWork}
                  </button>
                )}

                {timerState.isWorking && (
                  <button
                    onClick={startBreak}
                    className="w-full py-3 sm:py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-base sm:text-lg"
                  >
                    {t.buttons.takeBreak}
                  </button>
                )}

                {timerState.isBreak && (
                  <button
                    onClick={startWork}
                    className="w-full py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base sm:text-lg"
                  >
                    {t.buttons.continueWork}
                  </button>
                )}

                {(timerState.isWorking || timerState.isBreak) && (
                  <button
                    onClick={handleFinishWork}
                    className="w-full py-3 sm:py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-base sm:text-lg"
                  >
                    {t.buttons.finishWork}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base sm:text-lg text-gray-600">
                  <div className="text-center sm:text-left">{t.labels.totalWork}: {new Date(timerState.workTime).toISOString().substr(11, 8)}</div>
                  <div className="text-center sm:text-left">{t.labels.totalBreak}: {new Date(timerState.breakTime).toISOString().substr(11, 8)}</div>
                </div>

                {timerState.sessions.length > 0 && (
                  <button
                    onClick={() => setShowReport(true)}
                    className="flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all duration-200 font-medium border border-indigo-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                      <path d="M10 9H8" />
                    </svg>
                    {t.buttons.report}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">{t.labels.workReport}</h2>
                <button
                  onClick={resetTimers}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base flex items-center gap-2"
                >
                  <span>🔄</span> {t.buttons.newWork}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <span>⏱️</span> {t.labels.totalWork}
                  </h3>
                  <div className="text-3xl font-mono font-bold text-green-600">
                    {new Date(timerState.workTime).toISOString().substr(11, 8)}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <span>☕</span> {t.labels.totalBreak}
                  </h3>
                  <div className="text-3xl font-mono font-bold text-yellow-600">
                    {new Date(timerState.breakTime).toISOString().substr(11, 8)}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                  <span>📊</span> {t.labels.detailedSessions}
                </h3>
                <div className="space-y-4">
                  {timerState.sessions.map((session, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border ${
                        session.type === 'work' 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-yellow-200 bg-yellow-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-lg text-gray-800">
                          {session.type === 'work' ? `🎯 ${t.labels.workSession}` : `☕ ${t.labels.breakSession}`} #{index + 1}
                        </div>
                        {session.endTime && (
                          <div className={`font-mono font-bold ${
                            session.type === 'work' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {new Date(session.endTime - session.startTime).toISOString().substr(11, 8)}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="space-y-1">
                          <div className="font-medium">{t.labels.start}</div>
                          <div>{formatDateTime(session.startTime)}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium">{t.labels.end}</div>
                          <div>{session.endTime ? formatDateTime(session.endTime) : t.labels.ongoing}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Registration Promo or Welcome Message */}
        <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-4xl border border-indigo-100">
          <div className="text-center">
            {user ? (
              <>
                <h2 className="text-lg sm:text-xl font-bold text-indigo-900 mb-2">
                  {t.welcome.title.replace('{name}', user.firstName)}
                </h2>
                <p className="text-sm sm:text-base text-indigo-700 mb-4 max-w-2xl mx-auto">
                  {t.welcome.description}
                </p>
                <Link 
                  href="/panel" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  {t.welcome.panel}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-lg sm:text-xl font-bold text-indigo-900 mb-2">
                  {t.promo.title}
                </h2>
                <p className="text-sm sm:text-base text-indigo-700 mb-4 max-w-2xl mx-auto">
                  {t.promo.description}
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/register" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    {t.register}
                  </Link>
                  <Link href="/login" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-indigo-600">
                    {t.login}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {showReport && (
        <ReportModal
          timerState={timerState}
          onClose={() => setShowReport(false)}
          formatDateTime={formatDateTime}
          t={t}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          onConfirm={confirmFinishWork}
          onCancel={() => setShowConfirm(false)}
          t={t}
        />
      )}
    </div>
  );
}
