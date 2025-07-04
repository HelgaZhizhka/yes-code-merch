import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

export const ViewerStatus = {
  INITIAL: 'initial',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  GUEST: 'guest',
  ERROR: 'error',
} as const;

export type ViewerStatusType = (typeof ViewerStatus)[keyof typeof ViewerStatus];

export interface ViewerState {
  status: ViewerStatusType;
  session: Session | null;
  error: Error | null;

  setSession: (session: Session | null) => void;
  clearSession(): void;
  startLoading(): void;
  setError(error: Error): void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  status: ViewerStatus.INITIAL,
  session: null,
  error: null,

  setSession: (session) =>
    set({
      session,
      status: session ? ViewerStatus.AUTHENTICATED : ViewerStatus.GUEST,
      error: null,
    }),

  clearSession: () =>
    set({
      session: null,
      status: ViewerStatus.GUEST,
      error: null,
    }),

  startLoading: () =>
    set({
      status: ViewerStatus.LOADING,
    }),

  setError: (error: Error) => {
    set({
      status: ViewerStatus.ERROR,
      session: null,
      error,
    });
  },
}));

export const setSession = (session: Session | null) =>
  useViewerStore.getState().setSession(session);

export const setError = (error: Error) =>
  useViewerStore.getState().setError(error);

export const clearSession = () => useViewerStore.getState().clearSession();

export const startLoading = () => useViewerStore.getState().startLoading();

export const useStatus = () => useViewerStore((state) => state.status);

export const useError = () => useViewerStore((state) => state.error);
