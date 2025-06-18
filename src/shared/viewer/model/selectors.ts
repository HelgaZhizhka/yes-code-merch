import { useSessionStore } from './store';

export const isAuthorized = () => {
  return !!useSessionStore.getState().session?.user;
};
