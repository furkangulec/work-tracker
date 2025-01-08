import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '../translations';

interface NotesHeaderProps {
  onNewNote: () => void;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}

export function NotesHeader({ onNewNote, onSave, onClose, isSaving }: NotesHeaderProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="absolute top-0 left-0 right-0 z-50 p-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">{t.title}</h1>
          <div className="h-1 w-32 bg-white/20 rounded-full shadow-sm"></div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onNewNote}
            className="px-6 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium transform hover:scale-105 relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t.newNote}
          </button>
          <button
            onClick={onSave}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative"
            disabled={isSaving}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {isSaving ? t.saving : t.save}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium transform hover:scale-105 relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
} 