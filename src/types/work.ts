import { ObjectId } from 'mongodb';

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
} 