import { supabase } from './supabase';
import type { Member, LeaderboardEntry } from '@/types/database.types';

export async function getMembers(householdId: string): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('household_id', householdId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getMembersWithStats(householdId: string): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('household_leaderboard')
    .select('*')
    .eq('household_id', householdId)
    .order('total_points', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function promoteToAdmin(memberId: string) {
  const { error } = await supabase.rpc('promote_to_admin', {
    p_member_id: memberId,
  });

  if (error) throw error;
}

export async function demoteFromAdmin(memberId: string) {
  const { error } = await supabase.rpc('demote_from_admin', {
    p_member_id: memberId,
  });

  if (error) throw error;
}

export async function removeMember(memberId: string) {
  const { error } = await supabase.rpc('remove_member', {
    p_member_id: memberId,
  });

  if (error) throw error;
}

export async function leaveHousehold() {
  const { error } = await supabase.rpc('leave_household');

  if (error) throw error;
}

export async function regenerateJoinCode(householdId: string) {
  const { data, error } = await supabase.rpc('regenerate_join_code', {
    p_household_id: householdId,
  });

  if (error) throw error;
  return data;
}

export async function updateMemberProfile(
  memberId: string,
  updates: { display_name?: string; avatar_url?: string }
) {
  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', memberId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
