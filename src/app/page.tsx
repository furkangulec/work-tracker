'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Add translations
const translations = {
  tr: {
    title: 'Çalışma Takibi',
    register: 'Kayıt Ol',
    promo: {
      title: 'Çalışmalarını Kaydet!',
      description: 'Kayıt olarak tüm çalışma verilerini güvenle saklayabilir, geçmiş çalışmalarını görüntüleyebilir ve detaylı istatistikler elde edebilirsin.'
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
    promo: {
      title: 'Save Your Work!',
      description: 'By registering, you can securely store all your work data, view your past work sessions, and get detailed statistics.'
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
    promo: {
      title: '作業を記録しよう！',
      description: '登録すると、すべての作業データを安全に保存し、過去の作業セッションを表示し、詳細な統計を取得できます。'
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

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © {currentYear} Work Tracker - Furkan Güleç
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/furkangulec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/furkangulec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://www.buymeacoffee.com/furkangulec"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#FFDD00] text-gray-900 rounded-lg hover:bg-[#FFDD00]/90 transition-colors font-medium text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 884 1279" fill="none">
                <path d="M791.109 297.518L790.231 297.002L788.201 296.383C789.018 297.072 790.04 297.472 791.109 297.518Z" fill="#0D0C22"/>
                <path d="M803.896 388.891L802.916 389.166L803.896 388.891Z" fill="#0D0C22"/>
                <path d="M791.484 297.377C791.359 297.361 791.237 297.332 791.118 297.29C791.111 297.371 791.111 297.453 791.118 297.534C791.252 297.516 791.379 297.462 791.484 297.377Z" fill="#0D0C22"/>
                <path d="M791.113 297.529H791.244V297.447L791.113 297.529Z" fill="#0D0C22"/>
                <path d="M803.111 388.726L804.591 387.883L805.142 387.573L805.641 387.04C804.702 387.444 803.846 388.016 803.111 388.726Z" fill="#0D0C22"/>
                <path d="M793.669 299.515L792.223 298.138L791.243 297.605C791.77 298.535 792.641 299.221 793.669 299.515Z" fill="#0D0C22"/>
                <path d="M430.019 1186.18C428.864 1186.68 427.852 1187.46 427.076 1188.45L427.988 1187.87C428.608 1187.3 429.485 1186.63 430.019 1186.18Z" fill="#0D0C22"/>
                <path d="M641.187 1144.63C641.187 1143.33 640.551 1143.57 640.705 1148.21C640.705 1147.84 640.86 1147.46 640.929 1147.1C641.015 1146.27 641.084 1145.46 641.187 1144.63Z" fill="#0D0C22"/>
                <path d="M619.284 1186.18C618.129 1186.68 617.118 1187.46 616.342 1188.45L617.254 1187.87C617.873 1187.3 618.751 1186.63 619.284 1186.18Z" fill="#0D0C22"/>
                <path d="M281.304 1196.06C280.427 1195.3 279.354 1194.8 278.207 1194.61C279.136 1195.06 280.065 1195.51 280.684 1195.85L281.304 1196.06Z" fill="#0D0C22"/>
                <path d="M247.841 1164.01C247.704 1162.66 247.288 1161.35 246.619 1160.16C247.093 1161.39 247.489 1162.66 247.806 1163.94L247.841 1164.01Z" fill="#0D0C22"/>
                <path d="M472.623 590.836C426.682 610.503 374.546 632.802 306.976 632.802C278.71 632.746 250.58 628.868 223.353 621.274L270.086 1101.08C271.74 1121.13 280.876 1139.83 295.679 1153.46C310.482 1167.09 329.87 1174.65 349.992 1174.65C349.992 1174.65 416.254 1178.09 438.365 1178.09C462.161 1178.09 533.516 1174.65 533.516 1174.65C553.636 1174.65 573.019 1167.08 587.819 1153.45C602.619 1139.82 611.752 1121.13 613.406 1101.08L663.459 570.876C641.091 563.237 618.516 558.161 593.068 558.161C549.054 558.144 513.591 573.303 472.623 590.836Z" fill="#FFDD00"/>
                <path d="M78.6885 386.132L79.4799 386.872L79.9962 387.182C79.5987 386.787 79.1603 386.435 78.6885 386.132Z" fill="#0D0C22"/>
                <path d="M879.567 341.849L872.53 306.352C866.215 274.503 851.882 244.409 819.19 232.898C808.711 229.215 796.821 227.633 788.786 220.01C780.751 212.388 778.376 200.55 776.518 189.572C773.076 169.423 769.842 149.257 766.314 129.143C763.269 111.85 760.86 92.4243 752.928 76.56C742.604 55.2584 721.182 42.8009 699.88 34.559C688.965 30.4844 677.826 27.0375 666.517 24.2352C613.297 10.1947 557.342 5.03277 502.591 2.09047C436.875 -1.53577 370.983 -0.443234 305.422 5.35968C256.625 9.79894 205.229 15.1674 158.858 32.0469C141.91 38.224 124.445 45.6399 111.558 58.7341C95.7448 74.8221 90.5829 99.7026 102.128 119.765C110.336 134.012 124.239 144.078 138.985 150.737C158.192 159.317 178.251 165.846 198.829 170.215C256.126 182.879 315.471 187.851 374.007 189.968C438.887 192.586 503.87 190.464 568.44 183.618C584.408 181.863 600.347 179.758 616.257 177.304C634.995 174.43 647.022 149.928 641.499 132.859C634.891 112.453 617.134 104.538 597.055 107.618C594.095 108.082 591.153 108.512 588.193 108.942L586.06 109.252C579.257 110.113 572.455 110.915 565.653 111.661C551.601 113.175 537.515 114.414 523.394 115.378C491.768 117.58 460.057 118.595 428.363 118.647C397.219 118.647 366.058 117.769 334.983 115.722C320.805 114.793 306.661 113.611 292.552 112.177C286.134 111.506 279.733 110.801 273.333 110.009L267.241 109.235L265.917 109.046L259.602 108.134C246.697 106.189 233.792 103.953 221.025 101.251C219.737 100.965 218.584 100.249 217.758 99.2193C216.932 98.1901 216.482 96.9099 216.482 95.5903C216.482 94.2706 216.932 92.9904 217.758 91.9612C218.584 90.9319 219.737 90.2152 221.025 89.9293H221.266C232.33 87.5721 243.479 85.5589 254.663 83.8038C258.392 83.2188 262.131 82.6453 265.882 82.0832H265.985C272.988 81.6186 280.026 80.3625 286.994 79.5366C347.624 73.2301 408.614 71.0801 469.538 73.1014C499.115 73.9618 528.676 75.6996 558.116 78.6935C564.448 79.3474 570.746 80.0357 577.043 80.8099C579.452 81.1025 581.878 81.4465 584.305 81.7391L589.191 82.4445C603.438 84.5667 617.61 87.1419 631.708 90.1703C652.597 94.7128 679.422 96.1925 688.713 119.077C691.673 126.338 693.015 134.408 694.649 142.03L696.731 151.752C696.786 151.926 696.826 152.105 696.852 152.285C701.773 175.227 706.7 198.169 711.632 221.111C711.994 222.806 712.002 224.557 711.657 226.255C711.312 227.954 710.621 229.562 709.626 230.982C708.632 232.401 707.355 233.6 705.877 234.504C704.398 235.408 702.75 235.997 701.033 236.236H700.895L697.884 236.649L694.908 237.044C685.478 238.272 676.038 239.419 666.586 240.486C647.968 242.608 629.322 244.443 610.648 245.992C573.539 249.077 536.356 251.102 499.098 252.066C480.114 252.57 461.135 252.806 442.162 252.771C366.643 252.712 291.189 248.322 216.173 239.625C208.051 238.662 199.93 237.629 191.808 236.58C198.106 237.389 187.231 235.96 185.029 235.651C179.867 234.928 174.705 234.177 169.543 233.397C152.216 230.798 134.993 227.598 117.7 224.793C96.7944 221.352 76.8005 223.073 57.8906 233.397C42.3685 241.891 29.8055 254.916 21.8776 270.735C13.7217 287.597 11.2956 305.956 7.64786 324.075C4.00009 342.193 -1.67805 361.688 0.472751 380.288C5.10128 420.431 33.165 453.054 73.5313 460.35C111.506 467.232 149.687 472.807 187.971 477.556C338.361 495.975 490.294 498.178 641.155 484.129C653.44 482.982 665.708 481.732 677.959 480.378C681.786 479.958 685.658 480.398 689.292 481.668C692.926 482.938 696.23 485.005 698.962 487.717C701.694 490.429 703.784 493.718 705.08 497.342C706.377 500.967 706.846 504.836 706.453 508.665L702.633 545.797C694.936 620.828 687.239 695.854 679.542 770.874C671.513 849.657 663.431 928.434 655.298 1007.2C653.004 1029.39 650.71 1051.57 648.416 1073.74C646.213 1095.58 645.904 1118.1 641.757 1139.68C635.218 1173.61 612.248 1194.45 578.73 1202.07C548.022 1209.06 516.652 1212.73 485.161 1213.01C450.249 1213.2 415.355 1211.65 380.443 1211.84C343.173 1212.05 297.525 1208.61 268.756 1180.87C243.479 1156.51 239.986 1118.36 236.545 1085.37C231.957 1041.7 227.409 998.039 222.9 954.381L197.607 711.615L181.244 554.538C180.968 551.94 180.693 549.376 180.435 546.76C178.473 528.023 165.207 509.681 144.301 510.627C126.407 511.418 106.069 526.629 108.168 546.76L120.298 663.214L145.385 904.104C152.532 972.528 159.661 1040.96 166.773 1109.41C168.15 1122.52 169.44 1135.67 170.885 1148.78C178.749 1220.43 233.465 1259.04 301.224 1269.91C340.799 1276.28 381.337 1277.59 421.497 1278.24C472.979 1279.07 524.977 1281.05 575.615 1271.72C650.653 1257.95 706.952 1207.85 714.987 1130.13C717.282 1107.69 719.576 1085.25 721.87 1062.8C729.498 988.559 737.115 914.313 744.72 840.061L769.601 597.451L781.009 486.263C781.577 480.749 783.905 475.565 787.649 471.478C791.392 467.391 796.352 464.617 801.794 463.567C823.25 459.386 843.761 452.245 859.023 435.916C883.318 409.918 888.153 376.021 879.567 341.849ZM72.4301 365.835C72.757 365.68 72.1548 368.484 71.8967 369.792C71.8451 367.813 71.9483 366.058 72.4301 365.835ZM74.5121 381.94C74.6842 381.819 75.2003 382.508 75.7337 383.334C74.925 382.576 74.4089 382.009 74.4949 381.94H74.5121ZM76.5597 384.641C77.2996 385.897 77.6953 386.689 76.5597 384.641V384.641ZM80.672 387.979H80.7752C80.7752 388.1 80.9645 388.22 81.0333 388.341C80.9192 388.208 80.7925 388.087 80.6548 387.979H80.672ZM800.796 382.989C793.088 390.319 781.473 393.726 769.996 395.43C641.292 414.529 510.713 424.199 380.597 419.932C287.476 416.749 195.336 406.407 103.144 393.382C94.1102 392.109 84.3197 390.457 78.1082 383.798C66.4078 371.237 72.1548 345.944 75.2003 330.768C77.9878 316.865 83.3218 298.334 99.8572 296.355C125.667 293.327 155.64 304.218 181.175 308.09C211.917 312.781 242.774 316.538 273.745 319.36C405.925 331.405 540.325 329.529 671.92 311.91C695.905 308.686 719.805 304.941 743.619 300.674C764.835 296.871 788.356 289.731 801.175 311.703C809.967 326.673 811.137 346.701 809.778 363.615C809.359 370.984 806.139 377.915 800.779 382.989H800.796Z" fill="#0D0C22"/>
              </svg>
              Buy me a coffee
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [timerState, setTimerState] = useState<TimerState>(initialState);
  const [displayTime, setDisplayTime] = useState('00:00:00');
  const [showReport, setShowReport] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [language, setLanguage] = useState<'tr' | 'en' | 'ja'>('tr');

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

        {/* Registration Promo */}
        <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-4xl border border-indigo-100">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-3">
              {t.promo.title}
            </h2>
            <p className="text-base text-indigo-700 mb-6 max-w-2xl mx-auto">
              {t.promo.description}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 text-base font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {t.register}
            </Link>
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
