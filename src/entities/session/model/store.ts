import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

export interface SessionState {
  session: Session | null;
  isSessionLoaded: boolean;
  setSession: (session: Session | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  isSessionLoaded: false,
  setSession: (session) => set({ session, isSessionLoaded: true }),
}));
