export interface Note {
  id: string;
  content: string;
  position: { x: number; y: number };
  color: string;
  zIndex: number;
}

export interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  content: string;
} 