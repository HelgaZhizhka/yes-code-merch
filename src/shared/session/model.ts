import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

export interface SessionState {
  session: Session | null;
  isSessionLoaded: boolean;
  isAuthorized: boolean;
  setSession: (session: Session | null) => void;
  clearSession(): void;
}

export type SessionContext = Pick<
  SessionState,
  'isSessionLoaded' | 'isAuthorized'
>;

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  isAuthorized: false,
  isSessionLoaded: false,
  setSession: (session) =>
    set({ session, isSessionLoaded: true, isAuthorized: !!session?.user }),
  clearSession: () =>
    set({
      session: null,
      isSessionLoaded: false,
      isAuthorized: false,
    }),
}));

export const useIsAuthorized = () =>
  useSessionStore((state) => state.isAuthorized);

export const useIsSessionLoaded = () =>
  useSessionStore((state) => state.isSessionLoaded);

export const isSessionLoaded = () => {
  return useSessionStore.getState().isSessionLoaded;
};

export const setSession = (session: Session | null) => {
  useSessionStore.getState().setSession(session);
};

export const clearSession = () => {
  useSessionStore.getState().clearSession();
};
