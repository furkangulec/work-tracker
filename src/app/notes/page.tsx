'use client';

import { useState, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';

interface Note {
  id: string;
  content: string;
  position: { x: number; y: number };
  color: string;
  rotation: number;
}

const colors = [
  'bg-yellow-100',
  'bg-pink-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-purple-100',
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      position: {
        x: Math.random() * (window.innerWidth / 2 - 200),
        y: Math.random() * (window.innerHeight / 2 - 200)
      },
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 10 - 5 // -5 to +5 degrees
    };
    setNotes([...notes, newNote]);
  };

  const updateNoteContent = (id: string, content: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-amber-800/90 p-8">
      {/* Cork board background */}
      <div className="fixed inset-0 bg-repeat z-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Notlarım</h1>
        <button
          onClick={createNewNote}
          className="px-6 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Not
        </button>
      </div>

      {/* Notes Container */}
      <div className="relative z-10 min-h-[calc(100vh-12rem)]">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            drag
            dragMomentum={false}
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              rotate: note.rotation
            }}
            className={`absolute w-64 ${note.color} p-4 rounded-lg shadow-lg cursor-move`}
            style={{
              x: note.position.x,
              y: note.position.y
            }}
            whileHover={{ scale: 1.05 }}
            whileDrag={{ scale: 1.1 }}
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={() => deleteNote(note.id)}
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
    </div>
  );
} 