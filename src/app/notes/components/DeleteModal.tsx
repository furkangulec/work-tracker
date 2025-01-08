import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '../translations';
import { DeleteModalProps } from '../types';

export function DeleteModal({ onConfirm, onCancel, content }: DeleteModalProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t.deleteModal.title}</h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-600 line-clamp-3">{content}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {t.deleteModal.confirm}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            {t.deleteModal.cancel}
          </button>
        </div>
      </div>
    </div>
  );
} 