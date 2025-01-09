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
  );
} 