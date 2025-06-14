import { useSessionStore } from './store';

export const isAuthorized = () => {
  return !!useSessionStore.getState().session?.user;
};

export const getAccessToken = () => {
  return useSessionStore.getState().session?.access_token ?? null;
};
