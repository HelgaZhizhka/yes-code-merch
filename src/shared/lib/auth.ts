import { redirect } from '@tanstack/react-router';

import { ROUTES } from '@/shared/routing/types';

// TODO: auth logic here

export const requireAuth = (): void => {
  // TODO: implement auth logic here by default user no auth
  const isAuthenticated = false;

  if (!isAuthenticated) {
    throw redirect({
      to: ROUTES.LOGIN,
    });
  }
};

export const requireGuest = (): void => {
  // TODO: implement auth logic here by default user no auth
  const isAuthenticated = false;

  if (isAuthenticated) {
    throw redirect({ to: ROUTES.HOME });
  }
};
