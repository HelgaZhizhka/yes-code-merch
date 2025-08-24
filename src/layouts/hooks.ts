import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { ROUTES } from '@shared/config/routes';
import { router } from '@shared/routing';
import { useLogout, useViewerState } from '@shared/viewer';

export const useAuth = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { isAuthenticated, isGuest, isLoading, isError, error } =
    useViewerState();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('Logout successful');
      const currentRoute = router.state.location.pathname;
      if (currentRoute === ROUTES.PROFILE) {
        navigate({ to: ROUTES.HOME });
      }
    } catch {
      toast.error(error?.message ?? 'Logout failed');
    }
  }, [logout, navigate, error]);

  return { isLoading, isGuest, isAuthenticated, isError, error, handleLogout };
};
