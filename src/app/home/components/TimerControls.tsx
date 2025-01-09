import { useRouter } from 'next/navigation';
import { TimerState, TranslationType } from '../types';

interface TimerControlsProps {
  timerState: TimerState;
  onStartWork: () => void;
  onStartBreak: () => void;
  onFinishWork: () => void;
  onShowReport: () => void;
  user: { id: string; email: string; firstName: string; lastName: string } | null;
  t: TranslationType;
}

export function TimerControls({
  timerState,
  onStartWork,
  onStartBreak,
  onFinishWork,
  onShowReport,
  user,
  t
}: TimerControlsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!timerState.isWorking && !timerState.isBreak && (
          <button
            onClick={onStartWork}
            className="w-full py-3 sm:py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-base sm:text-lg"
            disabled={timerState.isWorking || timerState.isBreak}
          >
            {t.buttons.startWork}
          </button>
        )}

        {timerState.isWorking && (
          <>
            <button
              onClick={onStartBreak}
              className="w-full py-3 sm:py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-base sm:text-lg"
            >
              {t.buttons.takeBreak}
            </button>
          </>
        )}

        {timerState.isBreak && (
          <button
            onClick={onStartWork}
            className="w-full py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base sm:text-lg"
          >
            {t.buttons.continueWork}
          </button>
        )}

        {(timerState.isWorking || timerState.isBreak) && (
          <button
            onClick={onFinishWork}
            className="w-full py-3 sm:py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-base sm:text-lg"
          >
            {t.buttons.finishWork}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base sm:text-lg text-gray-600">
        <div className="text-center sm:text-left">{t.labels.totalWork}: {new Date(timerState.workTime).toISOString().substr(11, 8)}</div>
        <div className="text-center sm:text-left">{t.labels.totalBreak}: {new Date(timerState.breakTime).toISOString().substr(11, 8)}</div>
      </div>

      {user && timerState.isWorking && (
        <button
          onClick={() => router.push('/notes')}
          className="flex items-center justify-center gap-2 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium border-2 border-indigo-600 shadow-md hover:shadow-lg group"
        >
          <svg 
            className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
            />
          </svg>
          {t.buttons.addNote}
        </button>
      )}

      {timerState.sessions.length > 0 && (
        <button
          onClick={onShowReport}
          className="flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all duration-200 font-medium border border-indigo-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
          {t.buttons.report}
        </button>
      )}
    </div>
  );
} 