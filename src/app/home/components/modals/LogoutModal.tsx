import { ModalProps } from '../../types';

export function LogoutModal({ onConfirm, onCancel, t }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t.logoutModal.title}
        </h2>
        <p className="text-gray-600 mb-6">
          {t.logoutModal.message}
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {t.logoutModal.confirm}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            {t.logoutModal.cancel}
          </button>
        </div>
      </div>
    </div>
  );
} 