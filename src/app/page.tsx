'use client';

import { useState, useEffect } from 'react';

interface TimerState {
  isWorking: boolean;
  isBreak: boolean;
  workTime: number;
  breakTime: number;
  lastStartTime: number | null;
}

export default function Home() {
  const [timerState, setTimerState] = useState<TimerState>({
    isWorking: false,
    isBreak: false,
    workTime: 0,
    breakTime: 0,
    lastStartTime: null,
  });

  const [displayTime, setDisplayTime] = useState('00:00:00');

  useEffect(() => {
    // Load state from localStorage
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
      setTimerState(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState.isWorking || timerState.isBreak) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = timerState.lastStartTime ? now - timerState.lastStartTime : 0;
        
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
  }, [timerState.isWorking, timerState.isBreak, timerState.lastStartTime]);

  useEffect(() => {
    const formatTime = (time: number) => {
      const hours = Math.floor(time / 3600000);
      const minutes = Math.floor((time % 3600000) / 60000);
      const seconds = Math.floor((time % 60000) / 1000);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    setDisplayTime(formatTime(timerState.isBreak ? timerState.breakTime : timerState.workTime));
  }, [timerState.workTime, timerState.breakTime, timerState.isBreak]);

  const startWork = () => {
    setTimerState(prev => ({
      ...prev,
      isWorking: true,
      isBreak: false,
      lastStartTime: Date.now(),
    }));
  };

  const startBreak = () => {
    setTimerState(prev => ({
      ...prev,
      isWorking: false,
      isBreak: true,
      lastStartTime: Date.now(),
    }));
  };

  const pauseTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isWorking: false,
      isBreak: false,
      lastStartTime: null,
    }));
  };

  const resetTimers = () => {
    const newState = {
      isWorking: false,
      isBreak: false,
      workTime: 0,
      breakTime: 0,
      lastStartTime: null,
    };
    setTimerState(newState);
    localStorage.setItem('timerState', JSON.stringify(newState));
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Çalışma Takibi
        </h1>
        
        <div className="text-center mb-8">
          <div className="text-6xl font-mono font-bold mb-4 text-gray-900">
            {displayTime}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            {timerState.isWorking ? 'Çalışıyor' : timerState.isBreak ? 'Mola' : 'Duraklatıldı'}
          </div>
        </div>

        <div className="space-y-4">
          {!timerState.isWorking && !timerState.isBreak && (
            <button
              onClick={startWork}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Çalışmaya Başla
            </button>
          )}

          {timerState.isWorking && (
            <button
              onClick={startBreak}
              className="w-full py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Mola Ver
            </button>
          )}

          {timerState.isBreak && (
            <button
              onClick={startWork}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Çalışmaya Devam Et
            </button>
          )}

          {(timerState.isWorking || timerState.isBreak) && (
            <button
              onClick={pauseTimer}
              className="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Duraklat
            </button>
          )}

          <button
            onClick={resetTimers}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sıfırla
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <div>Toplam Çalışma: {new Date(timerState.workTime).toISOString().substr(11, 8)}</div>
          <div>Toplam Mola: {new Date(timerState.breakTime).toISOString().substr(11, 8)}</div>
        </div>
      </div>
    </main>
  );
}
