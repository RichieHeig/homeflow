import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/stores/useStore';
import type { Household, Member } from '@/types/database.types';

export function useSupabaseAuth() {
  const [loading, setLoading] = useState(true);
  const { setUser, setHousehold, setMembers } = useStore();

  const loadHouseholdData = async (userId: string) => {
    try {
      const { data: householdData, error: householdError } = await supabase
        .rpc('get_my_household');

      if (householdError) {
        console.error('Error fetching household:', householdError);
        throw householdError;
      }

      if (householdData && Array.isArray(householdData) && householdData.length > 0) {
        setHousehold(householdData[0] as Household);

        const { data: membersData, error: membersError } = await supabase
          .from('members')
          .select('*')
          .eq('household_id', householdData[0].id);

        if (membersError) {
          console.error('Error fetching members:', membersError);
          throw membersError;
        }

        setMembers(membersData as Member[] || []);
      } else {
        setHousehold(null);
        setMembers([]);
      }
    } catch (error) {
      console.error('Error loading household data:', error);
      setHousehold(null);
      setMembers([]);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          await loadHouseholdData(session.user.id);
        } else {
          setUser(null);
          setHousehold(null);
          setMembers([]);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setHousehold(null);
        setMembers([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      (async () => {
        try {
          if (session?.user) {
            setUser(session.user);
            await loadHouseholdData(session.user.id);
          } else {
            setUser(null);
            setHousehold(null);
            setMembers([]);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
        }
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setHousehold, setMembers]);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signInWithMagicLink = async (email: string, redirectTo?: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo || `${window.location.origin}/onboarding`,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      useStore.getState().clearSession();
    }
    return { error };
  };

  const refreshHouseholdData = async () => {
    const user = useStore.getState().user;
    if (user) {
      await loadHouseholdData(user.id);
    }
  };

  return {
    loading,
    signUp,
    signIn,
    signInWithMagicLink,
    signOut,
    refreshHouseholdData,
  };
}
