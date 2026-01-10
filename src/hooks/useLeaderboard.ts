import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { LeaderboardEntry } from '@/types/database.types';

export function useLeaderboard(householdId: string | null) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeaderboard = async () => {
    if (!householdId) {
      setLeaderboard([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('household_leaderboard')
        .select('*')
        .order('score_total', { ascending: false });

      if (fetchError) throw fetchError;

      setLeaderboard(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err as Error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    if (!householdId) return;

    const channel = supabase
      .channel('balance_scores_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'balance_scores',
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [householdId]);

  return {
    leaderboard,
    loading,
    error,
    refetch: fetchLeaderboard,
  };
}
