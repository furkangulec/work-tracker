import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { TimerState, initialState, TechniqueName } from '../types';

export function useWorkSession(
  user: { id: string; email: string; firstName: string; lastName: string } | null,
  timerState: TimerState,
  setTimerState: Dispatch<SetStateAction<TimerState>>
) {
  const startWorkLocally = useCallback((currentTime: number, technique: TechniqueName | null = null) => {
    setTimerState((prev: TimerState): TimerState => {
      const sessions = prev.sessions || [];
      
      // Close the last session if it's still open
      if (sessions.length > 0 && !sessions[sessions.length - 1].endTime) {
        sessions[sessions.length - 1].endTime = currentTime;
      }

      // Get technique from parameter or localStorage
      const savedTechnique = technique || localStorage.getItem('selectedTechnique') as TechniqueName | null;

      // Start new work session
      const newSessions = [...sessions, { 
        startTime: currentTime, 
        endTime: null, 
        type: 'work' as const 
      }];

      const newState = {
        ...prev,
        isWorking: true,
        isBreak: false,
        lastStartTime: currentTime,
        sessions: newSessions,
        isFinished: false,
        selectedTechnique: savedTechnique
      };

      localStorage.setItem('timerState', JSON.stringify(newState));
      return newState;
    });
  }, [setTimerState]);

  const startWork = useCallback(async (technique: TechniqueName | null = null) => {
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
              action: 'continue',
              technique: technique || timerState.selectedTechnique
            }),
          });
          const data = await response.json();

          if (!data.success) {
            throw new Error(data.error);
          }

          // Update local timer state with server response
          setTimerState((prev: TimerState): TimerState => ({
            ...prev,
            isWorking: true,
            isBreak: false,
            lastStartTime: currentTime,
            sessions: data.work.sessions,
            workTime: data.work.totalWorkTime,
            breakTime: data.work.totalBreakTime,
            selectedTechnique: data.work.technique || prev.selectedTechnique
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
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              technique: technique
            }),
          });
          const data = await response.json();

          if (!data.success) {
            throw new Error(data.error);
          }

          setTimerState((prev: TimerState): TimerState => ({
            ...prev,
            isWorking: true,
            isBreak: false,
            lastStartTime: currentTime,
            workId: data.workId,
            sessions: data.work.sessions,
            workTime: data.work.totalWorkTime,
            breakTime: data.work.totalBreakTime,
            isFinished: false,
            selectedTechnique: data.work.technique || technique
          }));
        }
      } catch (error) {
        console.error('Failed to start work:', error);
        alert(error instanceof Error ? error.message : 'Failed to start work');
        return;
      }
    } else {
      // Use localStorage for guests
      startWorkLocally(currentTime, technique);
    }
  }, [user, setTimerState, startWorkLocally, timerState.workId, timerState.sessions, timerState.selectedTechnique]);

  const startBreakLocally = useCallback((currentTime: number) => {
    setTimerState((prev: TimerState): TimerState => {
      const sessions = prev.sessions || [];
      
      // Close the last session if it's still open
      if (sessions.length > 0 && !sessions[sessions.length - 1].endTime) {
        sessions[sessions.length - 1].endTime = currentTime;
      }

      // Start new break session
      const newSessions = [...sessions, { 
        startTime: currentTime, 
        endTime: null, 
        type: 'break' as const 
      }];

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
  }, [setTimerState]);

  const startBreak = useCallback(async () => {
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

        // Update local timer state with server response
        setTimerState((prev: TimerState): TimerState => ({
          ...prev,
          isWorking: false,
          isBreak: true,
          lastStartTime: currentTime,
          sessions: data.work.sessions,
          workTime: data.work.totalWorkTime,
          breakTime: data.work.totalBreakTime
        }));
      } catch (error) {
        console.error('Failed to start break:', error);
        alert(error instanceof Error ? error.message : 'Failed to start break');
        return;
      }
    } else {
      // Use localStorage for guests
      startBreakLocally(currentTime);
    }
  }, [user, setTimerState, startBreakLocally, timerState.workId]);

  const finishWorkLocally = useCallback((currentTime: number) => {
    setTimerState((prev: TimerState): TimerState => {
      const sessions = prev.sessions || [];
      
      // Close the last session if it's still open
      if (sessions.length > 0 && !sessions[sessions.length - 1].endTime) {
        sessions[sessions.length - 1].endTime = currentTime;
      }

      const newState = {
        ...prev,
        isWorking: false,
        isBreak: false,
        lastStartTime: null,
        sessions,
        isFinished: true,
      };

      localStorage.setItem('timerState', JSON.stringify(newState));
      return newState;
    });
  }, [setTimerState]);

  const finishWork = useCallback(async () => {
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

        setTimerState((prev: TimerState): TimerState => ({
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
  }, [user, setTimerState, finishWorkLocally, timerState.workId]);

  const resetTimers = useCallback(() => {
    localStorage.setItem('timerState', JSON.stringify(initialState));
    setTimerState(initialState);
  }, [setTimerState]);

  return {
    startWork,
    startBreak,
    finishWork,
    resetTimers
  };
} 