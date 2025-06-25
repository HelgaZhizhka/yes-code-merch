import { useRouter } from '@tanstack/react-router';
import { useCallback } from 'react';

import { ROUTES } from '@shared/config/routes';
import { useLogout } from '@shared/viewer/hooks';
import {
  useIsAuthorized,
  useIsSessionLoaded,
} from '@shared/viewer/model/selectors';

export const useAuth = () => {
  const isAuthorized = useIsAuthorized();
  const isLoaded = useIsSessionLoaded();
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.navigate({ to: ROUTES.HOME });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logout, router]);

  return { isAuthorized, isLoaded, handleLogout };
};
