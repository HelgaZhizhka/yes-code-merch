import { create } from 'zustand';

import type { SessionState } from './interfaces';

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  isSessionLoaded: false,
  setSession: (session) => set({ session, isSessionLoaded: true }),
}));
