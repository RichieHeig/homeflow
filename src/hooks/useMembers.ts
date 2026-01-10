import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getMembersWithStats } from '@/lib/members';
import type { LeaderboardEntry } from '@/types/database.types';

export function useMembers(householdId: string | null, currentUserId?: string | null) {
  const [members, setMembers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMembers = async () => {
    if (!householdId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getMembersWithStats(householdId);
      setMembers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(err as Error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();

    if (!householdId) return;

    const channel = supabase
      .channel('members_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members',
          filter: `household_id=eq.${householdId}`,
        },
        () => {
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [householdId]);

  const currentMember = members.find(m => m.member_id === currentUserId);
  const currentUserRole = currentMember?.role || 'member';
  const isAdmin = currentUserRole === 'admin';

  return {
    members,
    loading,
    error,
    currentUserRole,
    isAdmin,
    refetch: fetchMembers,
  };
}
