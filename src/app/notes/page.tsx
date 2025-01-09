'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from './translations';
import { DeleteModal } from './components/DeleteModal';
import { NoteItem } from './components/NoteItem';
import { NotesHeader } from './components/NotesHeader';
import { CorkBoard } from './components/CorkBoard';
import { useNotes } from './hooks/useNotes';
import { useAuthCheck } from './hooks/useAuthCheck';

export default function NotesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { isLoading, workId } = useAuthCheck();
  const [deleteModal, setDeleteModal] = useState<{ id: string; content: string } | null>(null);
  const searchParams = useSearchParams();
  
  const {
    notes,
    isSaving,
    loadNotes,
    saveNotes,
    createNewNote,
    updateNoteContent,
    deleteNote,
    bringToFront,
    updateNotePosition,
    saveTimeoutRef
  } = useNotes(workId);

  const t = translations[language];

  // Load notes when workId is available
  useEffect(() => {
    if (workId) {
      loadNotes(workId);
    }
  }, [workId, loadNotes]);

  // Auto-save notes when they change
  useEffect(() => {
    if (!workId || notes.length === 0) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(() => {
      saveNotes();
    }, 1000); // Auto-save 1 second after last change

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [notes, workId, saveNotes, saveTimeoutRef]);

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

  const handleClose = () => {
    const paramWorkId = searchParams.get('workId');
    if (paramWorkId) {
      router.push(`/panel/works/${paramWorkId}`);
    } else {
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">{t.loading}</div>
      </div>
    );
  }

  return (
    <CorkBoard>
      <NotesHeader
        onNewNote={createNewNote}
        onSave={saveNotes}
        onClose={handleClose}
        isSaving={isSaving}
      />

      {/* Notes Container */}
      <div className="absolute inset-0 pt-32 px-8 pb-8 z-10 overflow-hidden">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onDelete={handleDeleteClick}
            onContentChange={updateNoteContent}
            onPositionChange={updateNotePosition}
            onBringToFront={bringToFront}
          />
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
    </CorkBoard>
  );
} 