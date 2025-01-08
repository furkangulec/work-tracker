import { useState, useRef, useCallback, useEffect } from 'react';
import { Note } from '../types';

const colors = [
  'bg-yellow-100',
  'bg-pink-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-purple-100',
];

export function useNotes(workId: string | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastSavedNotesRef = useRef<string>('');

  const loadNotes = useCallback(async (workId: string) => {
    if (!workId || isInitialized) return;

    try {
      const response = await fetch(`/api/notes?workId=${workId}`);
      const data = await response.json();

      if (data.success && data.notes) {
        const transformedNotes = data.notes.map((note: any) => ({
          id: note._id || note.id,
          content: note.content,
          color: note.color,
          zIndex: note.zIndex,
          position: note.position || { x: 0, y: 0 }
        }));
        
        setNotes(transformedNotes);
        lastSavedNotesRef.current = JSON.stringify(transformedNotes);
        
        const maxZ = transformedNotes.reduce((max: number, note: Note) => 
          Math.max(max, note.zIndex), 0);
        setMaxZIndex(maxZ + 1);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }, [isInitialized]);

  const saveNotes = useCallback(async (isManualSave = false) => {
    if (!workId) return;

    const currentNotesString = JSON.stringify(notes);
    if (currentNotesString === lastSavedNotesRef.current) {
      return; // Skip saving if notes haven't changed
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workId,
          notes: notes.map(note => ({
            ...note,
            position: {
              x: note.position.x,
              y: note.position.y
            }
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }
      
      lastSavedNotesRef.current = currentNotesString;

      // Add a small delay before hiding the saving indicator
      if (isManualSave) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setIsSaving(false);
    }
  }, [workId, notes]);

  const createNewNote = useCallback(() => {
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
    setNotes(prevNotes => [...prevNotes, newNote]);
    setMaxZIndex(prev => prev + 1);
  }, [maxZIndex]);

  const updateNoteContent = useCallback((id: string, content: string) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === id ? { ...note, content } : note
    ));

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout to save after user stops typing
    saveTimeoutRef.current = setTimeout(() => {
      saveNotes(false);
    }, 2000); // Wait 2 seconds after last keystroke
  }, [saveNotes]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    // Save immediately after deletion
    saveNotes(false);
  }, [saveNotes]);

  const bringToFront = useCallback((id: string) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === id ? { ...note, zIndex: maxZIndex } : note
    ));
    setMaxZIndex(prev => prev + 1);
  }, [maxZIndex]);

  const updateNotePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setNotes(prevNotes => prevNotes.map(note =>
      note.id === id ? { ...note, position } : note
    ));

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout to save after user stops moving the note
    saveTimeoutRef.current = setTimeout(() => {
      saveNotes(false);
    }, 1000); // Wait 1 second after last movement
  }, [saveNotes]);

  // Initial load
  useEffect(() => {
    if (workId) {
      loadNotes(workId);
    }
  }, [workId, loadNotes]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    notes,
    isSaving,
    loadNotes,
    saveNotes: () => saveNotes(true), // Always call manual save when using the save button
    createNewNote,
    updateNoteContent,
    deleteNote,
    bringToFront,
    updateNotePosition,
    saveTimeoutRef
  };
} 