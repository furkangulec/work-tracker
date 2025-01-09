'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '@/components/shared/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from './home/translations';
import { useTimer } from './home/hooks/useTimer';
import { useWorkSession } from './home/hooks/useWorkSession';
import { Timer, TimerControls, WorkReport, LanguageButton } from './home/components';
import { ConfirmModal, LogoutModal, ReportModal, TechniqueModal } from './home/components/modals';
import { User, TimerState, initialState, TechniqueName } from './home/types';

export default function Home() {
  const router = useRouter();
  const [showReport, setShowReport] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showTechniqueModal, setShowTechniqueModal] = useState(false);

  // Get translations for current language
  const t = translations[language];

  const { timerState, setTimerState, displayTime } = useTimer(user);
  const { startWork, startBreak, finishWork, resetTimers } = useWorkSession(user, timerState, setTimerState);

  // Auth check effect
  useEffect(() => {
    // Check if user is logged in by verifying JWT token from cookie
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (data.user) {
          // Set user first
          setUser(data.user);
          
          // Then check for active work session from database
          const activeResponse = await fetch('/api/work/check-active');
          const activeData = await activeResponse.json();
          
          if (activeData.success && activeData.activeWork) {
            const activeWork = activeData.activeWork;
            const lastSession = activeWork.sessions[activeWork.sessions.length - 1];
            const now = Date.now();
            
            // Calculate current session duration if it's ongoing
            let currentWorkTime = activeWork.totalWorkTime;
            let currentBreakTime = activeWork.totalBreakTime;
            
            if (lastSession && !lastSession.endTime) {
              const sessionDuration = now - lastSession.startTime;
              if (lastSession.type === 'work') {
                currentWorkTime += sessionDuration;
              } else {
                currentBreakTime += sessionDuration;
              }
            }
            
            setTimerState({
              isWorking: lastSession?.type === 'work' && !lastSession.endTime,
              isBreak: lastSession?.type === 'break' && !lastSession.endTime,
              workTime: currentWorkTime,
              breakTime: currentBreakTime,
              lastStartTime: lastSession?.endTime ? null : lastSession?.startTime,
              sessions: activeWork.sessions,
              isFinished: activeWork.isFinished,
              workId: activeWork.workId,
              selectedTechnique: activeWork.technique || null
            });
          } else {
            // If no active work session, reset timer state to initial
            setTimerState(initialState);
          }
          
          // Clear any existing local storage data
          localStorage.removeItem('timerState');
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      }
    }

    checkAuth();
  }, [setTimerState]);

  const handleFinishWork = () => {
    setShowConfirm(true);
  };

  const confirmFinishWork = () => {
    finishWork();
    setShowConfirm(false);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        // Clear local state
        setUser(null);
        setTimerState((prev: TimerState) => ({ ...prev, isFinished: true }));
        // Clear local storage
        localStorage.removeItem('timerState');
        // Close modal
        setShowLogoutModal(false);
        // Redirect to home
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleStartWorkClick = () => {
    // Only show technique modal if there are no sessions or the work is finished
    if (timerState.sessions.length === 0 || timerState.isFinished) {
      setShowTechniqueModal(true);
    } else {
      // If continuing after a break, start work directly
      startWork();
    }
  };

  const handleTechniqueConfirm = (technique: TechniqueName) => {
    setShowTechniqueModal(false);
    if (user) {
      // Start work with technique for logged in users
      startWork(technique);
    } else {
      // Store technique in localStorage for non-logged in users
      localStorage.setItem('selectedTechnique', technique);
      startWork();
    }
  };

  const handleTechniqueCancel = () => {
    setShowTechniqueModal(false);
    // Start work without any technique
    if (user) {
      startWork(null);
    } else {
      localStorage.removeItem('selectedTechnique');
      startWork();
    }
  };

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
              <Timer
                timerState={timerState}
                displayTime={displayTime}
                t={t}
              />

              <TimerControls
                timerState={timerState}
                onStartWork={handleStartWorkClick}
                onStartBreak={startBreak}
                onFinishWork={handleFinishWork}
                onShowReport={() => setShowReport(true)}
                user={user}
                t={t}
              />
            </>
          ) : (
            <WorkReport
              timerState={timerState}
              onReset={resetTimers}
              formatDateTime={formatDateTime}
              t={t}
            />
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
                <div className="flex justify-center gap-4">
                  <Link 
                    href="/panel" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md hover:shadow-lg"
                  >
                    {t.welcome.panel}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold shadow-md hover:shadow-lg border-2 border-indigo-600"
                  >
                    {t.welcome.logout}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
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
                  <button
                    onClick={() => handleNavigate('/register')}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    {t.register}
                  </button>
                  <button
                    onClick={() => handleNavigate('/login')}
                    className="px-6 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium border-2 border-indigo-600"
                  >
                    {t.login}
                  </button>
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

      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
          t={t}
        />
      )}

      {showTechniqueModal && (
        <TechniqueModal
          onConfirm={handleTechniqueConfirm}
          onCancel={handleTechniqueCancel}
          t={t}
        />
      )}
    </div>
  );
}

