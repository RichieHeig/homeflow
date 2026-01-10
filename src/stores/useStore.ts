import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js';
import type { Household, Member } from '@/types/database.types';

interface AppState {
  user: User | null;
  household: Household | null;
  members: Member[];
  isSidebarOpen: boolean;
  setUser: (user: User | null) => void;
  setHousehold: (household: Household | null) => void;
  setMembers: (members: Member[]) => void;
  toggleSidebar: () => void;
  clearSession: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      household: null,
      members: [],
      isSidebarOpen: true,
      setUser: (user) => set({ user }),
      setHousehold: (household) => set({ household }),
      setMembers: (members) => set({ members }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      clearSession: () => set({ user: null, household: null, members: [], isSidebarOpen: true }),
    }),
    {
      name: 'homeflow-storage',
      partialize: (state) => ({
        household: state.household,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);
