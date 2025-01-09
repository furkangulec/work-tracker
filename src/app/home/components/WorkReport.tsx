import { TimerState, TranslationType } from '../types';

interface WorkReportProps {
  timerState: TimerState;
  onReset: () => void;
  formatDateTime: (timestamp: number) => string;
  t: TranslationType;
}

export function WorkReport({ timerState, onReset, formatDateTime, t }: WorkReportProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">{t.labels.workReport}</h2>
        <button
          onClick={onReset}
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
  );
} 