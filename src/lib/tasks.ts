import { supabase } from './supabase';
import type { Database } from '@/types/database.types';

type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export const TASK_CATEGORIES = [
  { value: 'cuisine', label: 'Cuisine', emoji: '🍳', color: 'bg-orange-500' },
  { value: 'menage', label: 'Ménage', emoji: '🧹', color: 'bg-blue-500' },
  { value: 'linge', label: 'Linge', emoji: '👕', color: 'bg-purple-500' },
  { value: 'courses', label: 'Courses', emoji: '🛒', color: 'bg-green-500' },
  { value: 'administratif', label: 'Administratif', emoji: '📋', color: 'bg-yellow-500' },
  { value: 'enfants', label: 'Enfants', emoji: '👶', color: 'bg-pink-500' },
  { value: 'exterieur', label: 'Extérieur', emoji: '🌳', color: 'bg-teal-500' },
  { value: 'autre', label: 'Autre', emoji: '📦', color: 'bg-gray-500' },
];

export const DIFFICULTY_LABELS = {
  1: { label: 'Facile', icon: '😊', color: 'text-green-600 bg-green-100' },
  2: { label: 'Moyen', icon: '😐', color: 'text-yellow-600 bg-yellow-100' },
  3: { label: 'Difficile', icon: '😓', color: 'text-red-600 bg-red-100' },
} as const;

export const FREQUENCY_OPTIONS = [
  { value: null, label: 'Ponctuelle' },
  { value: 1, label: 'Quotidienne' },
  { value: 3, label: 'Tous les 3 jours' },
  { value: 7, label: 'Hebdomadaire' },
  { value: 14, label: 'Bi-mensuelle' },
  { value: 30, label: 'Mensuelle' },
];

export function getCategoryConfig(category: string) {
  return TASK_CATEGORIES.find(c => c.value === category) || TASK_CATEGORIES[TASK_CATEGORIES.length - 1];
}

export async function createTask(input: Omit<TaskInsert, 'id' | 'created_at' | 'deleted_at' | 'last_completed_at'>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTask(taskId: string, updates: TaskUpdate) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', taskId);

  if (error) throw error;
}

export async function completeTaskAction(taskId: string, memberId: string) {
  const { error } = await supabase.rpc('complete_task', {
    p_task_id: taskId,
    p_member_id: memberId,
  });

  if (error) throw error;
}
