import { useState } from 'react';
import { ModalProps } from '../../types';

interface TechniqueModalProps extends Omit<ModalProps, 'onConfirm'> {
  onConfirm: (technique: string) => void;
}

export function TechniqueModal({ onConfirm, onCancel, t }: TechniqueModalProps) {
  const [showTechniqueList, setShowTechniqueList] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {!showTechniqueList ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t.techniqueModal.title}</h2>
            <p className="mb-6 text-gray-900">{t.techniqueModal.message}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t.techniqueModal.no}
              </button>
              <button
                onClick={() => setShowTechniqueList(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t.buttons.continue}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t.techniqueModal.select}</h2>
            <div className="space-y-3 mb-6">
              {Object.entries(t.techniqueModal.techniques).map(([key, technique]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer group transition-colors"
                  onClick={() => onConfirm(key)}
                >
                  <span className="text-gray-900">{technique.name}</span>
                  <div className="relative">
                    <div className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-500 cursor-help">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        {technique.info}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t.techniqueModal.no}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 