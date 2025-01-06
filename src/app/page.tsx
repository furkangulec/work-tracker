'use client';

import { useState, useEffect, useRef } from 'react';

// Add translations
const translations = {
  tr: {
    title: 'Çalışma Takibi',
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
  currentLang: 'tr' | 'en';
  onLanguageChange: (lang: 'tr' | 'en') => void;
}

interface LanguageOption {
  code: 'tr' | 'en';
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
  }
];

function LanguageButton({ currentLang, onLanguageChange }: LanguageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
    <div className="relative" ref={dropdownRef}>
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
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                onLanguageChange(language.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors ${
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
      )}
    </div>
  );
}

interface ReportModalProps {
  timerState: TimerState;
  onClose: () => void;
  formatDateTime: (timestamp: number) => string;
  t: typeof translations.tr | typeof translations.en;
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
  t: typeof translations.tr | typeof translations.en;
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
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');

  // Get translations for current language
  const t = translations[language];

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
        const now = Date.now();
        
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

  const startWork = () => {
    const now = Date.now();
    setTimerState(prev => {
      const sessions = prev.sessions || [];
      const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
      
      if (lastSession && lastSession.endTime === null) {
        lastSession.endTime = now;
      }

      const newSessions = [...sessions, { startTime: now, endTime: null, type: 'work' as const }];
      const newState = {
        ...prev,
        isWorking: true,
        isBreak: false,
        lastStartTime: now,
        sessions: newSessions,
        isFinished: false,
      };
      localStorage.setItem('timerState', JSON.stringify(newState));
      return newState;
    });
  };

  const startBreak = () => {
    const now = Date.now();
    setTimerState(prev => {
      const sessions = prev.sessions || [];
      const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
      
      if (lastSession && lastSession.endTime === null) {
        lastSession.endTime = now;
      }

      const newSessions = [...sessions, { startTime: now, endTime: null, type: 'break' as const }];
      const newState = {
        ...prev,
        isWorking: false,
        isBreak: true,
        lastStartTime: now,
        sessions: newSessions,
      };
      localStorage.setItem('timerState', JSON.stringify(newState));
      return newState;
    });
  };

  const finishWork = () => {
    const now = Date.now();
    setTimerState(prev => {
      const sessions = prev.sessions || [];
      const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
      
      if (lastSession && lastSession.endTime === null) {
        lastSession.endTime = now;
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
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-800">
              {t.title}
            </h1>
            <div className="flex items-center gap-4">
              <LanguageButton
                currentLang={language}
                onLanguageChange={setLanguage}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 flex flex-col items-center">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl">
          {!timerState.isFinished ? (
            <>
              <div className="text-center mb-8">
                <div className="text-8xl font-mono font-bold mb-4 text-gray-900">
                  {displayTime}
                </div>
                <div className="text-lg text-gray-600 mb-2">
                  {timerState.isWorking ? t.status.working : timerState.isBreak ? t.status.break : t.status.notStarted}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {!timerState.isWorking && !timerState.isBreak && (
                  <button
                    onClick={startWork}
                    className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
                  >
                    {t.buttons.startWork}
                  </button>
                )}

                {timerState.isWorking && (
                  <button
                    onClick={startBreak}
                    className="w-full py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-lg"
                  >
                    {t.buttons.takeBreak}
                  </button>
                )}

                {timerState.isBreak && (
                  <button
                    onClick={startWork}
                    className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
                  >
                    {t.buttons.continueWork}
                  </button>
                )}

                {(timerState.isWorking || timerState.isBreak) && (
                  <button
                    onClick={handleFinishWork}
                    className="w-full py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-lg"
                  >
                    {t.buttons.finishWork}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 text-lg text-gray-600">
                  <div>{t.labels.totalWork}: {new Date(timerState.workTime).toISOString().substr(11, 8)}</div>
                  <div>{t.labels.totalBreak}: {new Date(timerState.breakTime).toISOString().substr(11, 8)}</div>
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
      </main>

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
