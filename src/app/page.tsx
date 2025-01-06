'use client';

import { useState, useEffect } from 'react';

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

interface ReportModalProps {
  timerState: TimerState;
  onClose: () => void;
  formatDateTime: (timestamp: number) => string;
}

function ReportModal({ timerState, onClose, formatDateTime }: ReportModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Mevcut Rapor</h2>
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
              <span>⏱️</span> Toplam Çalışma
            </h3>
            <div className="text-3xl font-mono font-bold text-green-600">
              {new Date(timerState.workTime).toISOString().substr(11, 8)}
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span>☕</span> Toplam Mola
            </h3>
            <div className="text-3xl font-mono font-bold text-yellow-600">
              {new Date(timerState.breakTime).toISOString().substr(11, 8)}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <span>📊</span> Detaylı Oturumlar
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
                    {session.type === 'work' ? '🎯 Çalışma' : '☕ Mola'} #{index + 1}
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
                    <div className="font-medium">Başlangıç</div>
                    <div>{formatDateTime(session.startTime)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Bitiş</div>
                    <div>{session.endTime ? formatDateTime(session.endTime) : 'Devam Ediyor'}</div>
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
}

function ConfirmModal({ onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Çalışmayı Bitir</h2>
        <p className="text-gray-600 mb-6">
          Çalışmayı bitirmek istediğinize emin misiniz? Bu işlem geri alınamaz ve mevcut çalışma oturumunuz sonlandırılacaktır.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Evet, Bitir
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            İptal
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
    return new Date(timestamp).toLocaleString('tr-TR', {
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Çalışma Takibi
          </h1>
          {!timerState.isFinished && timerState.sessions.length > 0 && (
            <button
              onClick={() => setShowReport(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all duration-200 font-medium border border-indigo-100 shadow-sm"
              title="Raporu Görüntüle"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
              Rapor
            </button>
          )}
        </div>
        
        {!timerState.isFinished ? (
          <>
            <div className="text-center mb-8">
              <div className="text-8xl font-mono font-bold mb-4 text-gray-900">
                {displayTime}
              </div>
              <div className="text-lg text-gray-600 mb-2">
                {timerState.isWorking ? 'Çalışıyor' : timerState.isBreak ? 'Mola' : 'Henüz Başlamadı'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {!timerState.isWorking && !timerState.isBreak && (
                <button
                  onClick={startWork}
                  className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
                >
                  Çalışmaya Başla
                </button>
              )}

              {timerState.isWorking && (
                <button
                  onClick={startBreak}
                  className="w-full py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-lg"
                >
                  Mola Ver
                </button>
              )}

              {timerState.isBreak && (
                <button
                  onClick={startWork}
                  className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                  Çalışmaya Devam Et
                </button>
              )}

              {(timerState.isWorking || timerState.isBreak) && (
                <button
                  onClick={handleFinishWork}
                  className="w-full py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-lg"
                >
                  Çalışmayı Bitir
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-lg text-gray-600">
              <div>Toplam Çalışma: {new Date(timerState.workTime).toISOString().substr(11, 8)}</div>
              <div>Toplam Mola: {new Date(timerState.breakTime).toISOString().substr(11, 8)}</div>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">Çalışma Raporu</h2>
              <button
                onClick={resetTimers}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base flex items-center gap-2"
              >
                <span>🔄</span> Yeni Çalışmaya Başla
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>⏱️</span> Toplam Çalışma
                </h3>
                <div className="text-3xl font-mono font-bold text-green-600">
                  {new Date(timerState.workTime).toISOString().substr(11, 8)}
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>☕</span> Toplam Mola
                </h3>
                <div className="text-3xl font-mono font-bold text-yellow-600">
                  {new Date(timerState.breakTime).toISOString().substr(11, 8)}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                <span>📊</span> Detaylı Oturumlar
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
                        {session.type === 'work' ? '🎯 Çalışma' : '☕ Mola'} #{index + 1}
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
                        <div className="font-medium">Başlangıç</div>
                        <div>{formatDateTime(session.startTime)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Bitiş</div>
                        <div>{session.endTime ? formatDateTime(session.endTime) : 'Devam Ediyor'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showReport && (
        <ReportModal
          timerState={timerState}
          onClose={() => setShowReport(false)}
          formatDateTime={formatDateTime}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          onConfirm={confirmFinishWork}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </main>
  );
}
