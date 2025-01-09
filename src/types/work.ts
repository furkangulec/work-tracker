import { ObjectId } from 'mongodb';
import { TechniqueName } from '@/app/home/types';

export interface WorkSession {
  startTime: number;
  endTime: number | null;
  type: 'work' | 'break';
}

export interface Work {
  _id?: ObjectId;
  userId: string;
  startTime: number;
  endTime: number | null;
  isFinished: boolean;
  sessions: WorkSession[];
  totalWorkTime: number;
  totalBreakTime: number;
  hasNotes?: boolean;
  technique?: TechniqueName | null;
} 