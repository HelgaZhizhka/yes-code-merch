import { create } from 'zustand';

import type { SessionState } from './interfaces';

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
}));
