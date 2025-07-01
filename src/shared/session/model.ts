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

export const useIsAuthorized = () =>
  useSessionStore((state) => !!state.session?.user);

export const useIsSessionLoaded = () =>
  useSessionStore((state) => state.isSessionLoaded);

export const isAuthorized = () => {
  return !!useSessionStore.getState().session?.user;
};

export const isSessionLoaded = () => {
  return useSessionStore.getState().isSessionLoaded;
};
