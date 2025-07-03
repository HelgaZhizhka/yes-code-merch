import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { ROUTES } from '@shared/config/routes';
import { router } from '@shared/routing';
import { useIsAuthorized, useIsSessionLoaded } from '@shared/session/model';
import { useLogout } from '@shared/viewer/hooks';

export const useAuth = () => {
  const isAuthorized = useIsAuthorized();
  const isLoaded = useIsSessionLoaded();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('Logout successful');
      const currentRoute = router.state.location.pathname;
      if (currentRoute === ROUTES.PROFILE) {
        navigate({ to: ROUTES.HOME });
      }
    } catch {
      toast.error('Logout failed');
    }
  }, [logout, navigate]);

  return { isAuthorized, isLoaded, handleLogout };
};
