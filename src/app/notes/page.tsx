'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Note {
  id: string;
  content: string;
  position: { x: number; y: number };
  color: string;
  zIndex: number;
}

const colors = [
  'bg-yellow-100',
  'bg-pink-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-purple-100',
];

interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  content: string;
}

function DeleteModal({ onConfirm, onCancel, content }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Notu Silmek İstediğinize Emin Misiniz?</h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-600 line-clamp-3">{content}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Evet, Sil
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{ id: string; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth & active work session check
  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Check if user is logged in
        const authResponse = await fetch('/api/auth/check');
        const authData = await authResponse.json();
        
        if (!authData.user) {
          router.push('/login');
          return;
        }

        // Check if user has active work session
        const activeWorkResponse = await fetch('/api/work/check-active');
        const activeWorkData = await activeWorkResponse.json();
        
        if (!activeWorkData.success || !activeWorkData.activeWork) {
          router.push('/');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Access check error:', error);
        router.push('/login');
      }
    };

    checkAccess();
  }, [router]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      position: {
        x: Math.random() * (window.innerWidth / 2 - 200),
        y: Math.random() * (window.innerHeight / 2 - 200)
      },
      color: colors[Math.floor(Math.random() * colors.length)],
      zIndex: maxZIndex
    };
    setNotes([...notes, newNote]);
    setMaxZIndex(prev => prev + 1);
  };

  const updateNoteContent = (id: string, content: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const bringToFront = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, zIndex: maxZIndex } : note
    ));
    setMaxZIndex(prev => prev + 1);
  };

  const handleDeleteClick = (id: string, content: string) => {
    if (content.trim() === '') {
      deleteNote(id);
    } else {
      setDeleteModal({ id, content });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteModal) {
      deleteNote(deleteModal.id);
      setDeleteModal(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{
      background: `
        repeating-linear-gradient(
          45deg,
          rgb(191, 129, 82),
          rgb(191, 129, 82) 2px,
          rgb(186, 124, 77) 2px,
          rgb(186, 124, 77) 4px
        ),
        repeating-linear-gradient(
          -45deg,
          rgb(191, 129, 82),
          rgb(191, 129, 82) 2px,
          rgb(186, 124, 77) 2px,
          rgb(186, 124, 77) 4px
        ),
        linear-gradient(
          to bottom,
          rgb(181, 119, 72),
          rgb(181, 119, 72)
        )
      `,
      boxShadow: 'inset 0 0 100px rgba(0,0,0,0.2)'
    }}>
      {/* Cork board texture overlay */}
      <div 
        className="fixed inset-0 bg-repeat opacity-50 mix-blend-overlay pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='25' cy='25' r='1' /%3E%3Ccircle cx='75' cy='25' r='1' /%3E%3Ccircle cx='25' cy='75' r='1' /%3E%3Ccircle cx='75' cy='75' r='1' /%3E%3Ccircle cx='50' cy='50' r='1' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Notlarım</h1>
          <div className="h-1 w-32 bg-white/20 rounded-full shadow-sm"></div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={createNewNote}
            className="px-6 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Not
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Kapat
          </button>
        </div>
      </div>

      {/* Notes Container */}
      <div className="relative z-10 min-h-[calc(100vh-12rem)]">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            drag
            dragMomentum={false}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute w-64 ${note.color} p-4 rounded-lg shadow-xl cursor-move backdrop-blur-sm backdrop-brightness-110 group`}
            style={{
              x: note.position.x,
              y: note.position.y,
              zIndex: note.zIndex,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
            whileDrag={{ scale: 1.1, boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="flex justify-between mb-2">
              <button
                onClick={() => bringToFront(note.id)}
                className="text-gray-500 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Öne Getir"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => handleDeleteClick(note.id, note.content)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <textarea
              value={note.content}
              onChange={(e) => updateNoteContent(note.id, e.target.value)}
              placeholder="Notunuzu buraya yazın..."
              className={`w-full h-32 bg-transparent border-none resize-none focus:ring-0 text-gray-700 placeholder-gray-500`}
              style={{ fontFamily: "'Comic Sans MS', cursive" }}
            />
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-gray-300 rounded-full shadow-inner border-2 border-gray-400" />
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <DeleteModal
          content={deleteModal.content}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
} 