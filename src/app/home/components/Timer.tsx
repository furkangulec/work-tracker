import { TimerState, TranslationType } from '../types';

interface TimerProps {
  timerState: TimerState;
  displayTime: string;
  t: TranslationType;
}

export function Timer({ timerState, displayTime, t }: TimerProps) {
  return (
    <div className="text-center mb-8">
      <div className="text-6xl sm:text-8xl md:text-9xl font-mono font-bold mb-4 text-gray-900 break-all sm:break-normal">
        {displayTime}
      </div>
      <div className="flex flex-col items-center gap-2">
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

        {timerState.isWorking && timerState.selectedTechnique && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-blue-50 text-blue-800 border border-blue-100">
            <span>{t.techniqueModal.techniques[timerState.selectedTechnique].name}</span>
            <div className="relative group">
              <div className="w-5 h-5 flex items-center justify-center text-blue-600 cursor-help">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-blue-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {t.techniqueModal.techniques[timerState.selectedTechnique].info}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 