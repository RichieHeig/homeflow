import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { completeTaskAction } from '@/lib/tasks';
import type { Task } from '@/types/database.types';

export function useTasks(householdId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = async () => {
    if (!householdId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('household_id', householdId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setTasks(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err as Error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string, memberId: string) => {
    try {
      await completeTaskAction(taskId, memberId);
      await fetchTasks();
    } catch (err) {
      console.error('Error completing task:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();

    if (!householdId) return;

    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `household_id=eq.${householdId}`,
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [householdId]);

  return {
    tasks,
    loading,
    error,
    completeTask,
    refetch: fetchTasks,
  };
}
