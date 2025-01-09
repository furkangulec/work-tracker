import { useState, useEffect, useCallback } from 'react';
import { TimerState, initialState } from '../types';

export function useTimer(user: { id: string; email: string; firstName: string; lastName: string } | null) {
  const [timerState, setTimerState] = useState<TimerState>(initialState);
  const [displayTime, setDisplayTime] = useState('00:00:00');

  // Server sync effect for logged in users
  useEffect(() => {
    if (!user) return;

    const syncWithServer = async () => {
      if (!timerState.workId) return;

      try {
        const response = await fetch(`/api/work/${timerState.workId}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to sync with server');
        }

        const serverWork = data.work;
        if (!serverWork) return;

        // Get the last session from server
        const lastServerSession = serverWork.sessions[serverWork.sessions.length - 1];
        if (!lastServerSession) return;

        // If session is still ongoing, calculate elapsed time
        if (!lastServerSession.endTime) {
          const elapsedTime = Date.now() - lastServerSession.startTime;
          const isWorkSession = lastServerSession.type === 'work';

          setTimerState(prev => ({
            ...prev,
            isWorking: isWorkSession,
            isBreak: !isWorkSession,
            [isWorkSession ? 'workTime' : 'breakTime']: elapsedTime,
            lastStartTime: lastServerSession.startTime,
            sessions: serverWork.sessions,
            isFinished: serverWork.isFinished
          }));
        }
      } catch (error) {
        console.error('Error syncing with server:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncWithServer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    syncWithServer(); // Initial sync
    const syncInterval = setInterval(syncWithServer, 30000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(syncInterval);
    };
  }, [user, timerState.workId]);

  // Local storage state initialization
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('timerState');
      if (!savedState) return;

      const parsedState = JSON.parse(savedState) as TimerState;
      const now = Date.now();

      // Calculate time for non-logged in users
      if (!user && !parsedState.isFinished) {
        let totalWorkTime = 0;
        let totalBreakTime = 0;

        // Check all sessions
        parsedState.sessions.forEach((session, index) => {
          if (session.endTime) {
            // Calculate duration for completed sessions
            const sessionDuration = session.endTime - session.startTime;
            if (session.type === 'work') {
              totalWorkTime += sessionDuration;
            } else {
              totalBreakTime += sessionDuration;
            }
          } else if (index === parsedState.sessions.length - 1) {
            // Calculate duration for ongoing last session
            const sessionDuration = now - session.startTime;
            if (session.type === 'work') {
              totalWorkTime += sessionDuration;
            } else {
              totalBreakTime += sessionDuration;
            }
          }
        });

        // Check last session status
        const lastSession = parsedState.sessions[parsedState.sessions.length - 1];
        const isActiveSession = lastSession && !lastSession.endTime;

        setTimerState({
          ...parsedState,
          workTime: totalWorkTime,
          breakTime: totalBreakTime,
          isWorking: isActiveSession && lastSession.type === 'work',
          isBreak: isActiveSession && lastSession.type === 'break',
          lastStartTime: isActiveSession ? lastSession.startTime : null,
        });
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
      setTimerState(initialState);
    }
  }, [user]);

  // Timer update effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if ((timerState.isWorking || timerState.isBreak) && timerState.lastStartTime) {
      interval = setInterval(() => {
        setTimerState(prev => {
          const newState = {
            ...prev,
            workTime: prev.isWorking ? prev.workTime + 1000 : prev.workTime,
            breakTime: prev.isBreak ? prev.breakTime + 1000 : prev.breakTime,
          };

          // Save to localStorage for non-logged in users
          if (!user) {
            localStorage.setItem('timerState', JSON.stringify(newState));
          }
          
          return newState;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState.isWorking, timerState.isBreak, timerState.lastStartTime, user]);

  // Display time update effect
  useEffect(() => {
    const formatTime = (time: number) => {
      const hours = Math.floor(time / 3600000);
      const minutes = Math.floor((time % 3600000) / 60000);
      const seconds = Math.floor((time % 60000) / 1000);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    setDisplayTime(formatTime(timerState.isBreak ? timerState.breakTime : timerState.workTime));
  }, [timerState.workTime, timerState.breakTime, timerState.isBreak]);

  return {
    timerState,
    setTimerState,
    displayTime
  };
} 