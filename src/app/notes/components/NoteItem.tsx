import { motion } from 'framer-motion';
import { Note } from '../types';

interface NoteItemProps {
  note: Note;
  onDelete: (id: string, content: string) => void;
  onContentChange: (id: string, content: string) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onBringToFront: (id: string) => void;
}

export function NoteItem({ note, onDelete, onContentChange, onPositionChange, onBringToFront }: NoteItemProps) {
  return (
    <motion.div
      key={note.id}
      drag
      dragMomentum={false}
      dragConstraints={{
        left: 0,
        right: window.innerWidth - 300,
        top: 0,
        bottom: window.innerHeight - 250
      }}
      initial={{ scale: 0, x: note.position.x, y: note.position.y }}
      animate={{ 
        scale: 1,
        x: Math.min(Math.max(note.position.x, 0), window.innerWidth - 300),
        y: Math.min(Math.max(note.position.y, 0), window.innerHeight - 250)
      }}
      onDragEnd={(event, info) => {
        const newX = Math.min(Math.max(note.position.x + info.offset.x, 0), window.innerWidth - 300);
        const newY = Math.min(Math.max(note.position.y + info.offset.y, 0), window.innerHeight - 250);
        onPositionChange(note.id, { x: newX, y: newY });
      }}
      className={`absolute w-64 ${note.color} p-4 rounded-lg shadow-xl cursor-move backdrop-blur-sm backdrop-brightness-110 group`}
      style={{
        zIndex: note.zIndex,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)'
      }}
      whileHover={{ scale: 1.05, boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
      whileDrag={{ scale: 1.1, boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
    >
      <div className="flex justify-between mb-2">
        <button
          onClick={() => onBringToFront(note.id)}
          className="text-gray-500 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
          title="Öne Getir"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(note.id, note.content)}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <textarea
        value={note.content}
        onChange={(e) => onContentChange(note.id, e.target.value)}
        placeholder="Notunuzu buraya yazın..."
        className={`w-full h-32 bg-transparent border-none resize-none focus:ring-0 text-gray-700 placeholder-gray-500`}
        style={{ fontFamily: "'Comic Sans MS', cursive" }}
      />
      {/* Pushpin design */}
      <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full shadow-lg transform hover:scale-105 transition-transform" style={{
        background: 'radial-gradient(circle at 40% 40%, #f8fafc 0%, #cbd5e1 100%)',
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: `
          0 2px 4px rgba(0,0,0,0.1),
          inset 0 2px 4px rgba(255,255,255,0.5),
          inset 0 -2px 4px rgba(0,0,0,0.1),
          0 0 0 3px rgba(0,0,0,0.05)
        `
      }}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{
          background: 'radial-gradient(circle at 30% 30%, #475569 0%, #1e293b 100%)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
        }} />
      </div>
    </motion.div>
  );
} 