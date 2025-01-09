import { translations } from '../translations';

export interface WorkSession {
  startTime: number;
  endTime: number | null;
  type: 'work' | 'break';
}

export type TechniqueName = 'pomodoro' | '52-17' | '90-20';

export interface TimerState {
  isWorking: boolean;
  isBreak: boolean;
  workTime: number;
  breakTime: number;
  lastStartTime: number | null;
  sessions: WorkSession[];
  isFinished: boolean;
  workId?: string;
  selectedTechnique?: TechniqueName | null;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export type TranslationType = typeof translations.tr | typeof translations.en | typeof translations.ja;

export interface LanguageOption {
  code: 'tr' | 'en' | 'ja';
  flag: string;
  name: string;
}

export interface ModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  t: TranslationType;
}

export interface ReportModalProps {
  timerState: TimerState;
  onClose: () => void;
  formatDateTime: (timestamp: number) => string;
  t: TranslationType;
}

export const initialState: TimerState = {
  isWorking: false,
  isBreak: false,
  workTime: 0,
  breakTime: 0,
  lastStartTime: null,
  sessions: [],
  isFinished: false,
  selectedTechnique: null,
}; 