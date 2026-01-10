export type { Task, Member, Household } from './database.types';

export type Difficulty = 1 | 2 | 3;
export type MemberRole = 'admin' | 'member';

export interface TaskFilters {
  category?: string[];
  difficulty?: Difficulty[];
  completedRecently?: boolean;
}

export interface TaskSuggestion {
  id: string;
  household_id: string;
  title: string;
  category: string;
  duration_min: number;
  difficulty: Difficulty;
  score: number;
  reason: string;
}
