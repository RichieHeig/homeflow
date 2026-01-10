export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      households: {
        Row: {
          id: string
          name: string
          join_code: string
          created_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          join_code: string
          created_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          join_code?: string
          created_at?: string
          deleted_at?: string | null
        }
      }
      members: {
        Row: {
          id: string
          household_id: string
          display_name: string
          avatar_url: string | null
          role: 'admin' | 'member'
          energy_profile: string | null
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          display_name: string
          avatar_url?: string | null
          role?: 'admin' | 'member'
          energy_profile?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          display_name?: string
          avatar_url?: string | null
          role?: 'admin' | 'member'
          energy_profile?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          household_id: string
          title: string
          category: string
          duration_min: number
          difficulty: 1 | 2 | 3
          frequency_days: number | null
          last_completed_at: string | null
          deleted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          title: string
          category: string
          duration_min: number
          difficulty: 1 | 2 | 3
          frequency_days?: number | null
          last_completed_at?: string | null
          deleted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          title?: string
          category?: string
          duration_min?: number
          difficulty?: 1 | 2 | 3
          frequency_days?: number | null
          last_completed_at?: string | null
          deleted_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export interface Member {
  id: string
  household_id: string
  display_name: string
  avatar_url: string | null
  role: 'admin' | 'member'
  energy_profile: string | null
  created_at: string
}

export interface Task {
  id: string
  household_id: string
  title: string
  category: string
  duration_min: number
  difficulty: 1 | 2 | 3
  frequency_days: number | null
  last_completed_at: string | null
  deleted_at: string | null
  created_at: string
}

export interface Household {
  id: string
  name: string
  join_code: string
  created_at: string
  deleted_at: string | null
}

export interface LeaderboardEntry {
  member_id: string
  household_id: string
  display_name: string
  avatar_url: string | null
  role: 'admin' | 'member'
  total_points: number
  tasks_completed: number
  contribution_percent: number
}
