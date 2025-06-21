import { useSessionStore } from './store';

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
