import { ReportModalProps } from '../../types';

export function ReportModal({ timerState, onClose, formatDateTime, t }: ReportModalProps) {
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
                    {session.type === 'work' ? `🎯 ${t.labels.workSession}` : `☕☕ ${t.labels.breakSession}`} #{index + 1}
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