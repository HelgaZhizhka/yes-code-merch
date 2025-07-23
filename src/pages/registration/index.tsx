import { Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import { ONBOARDING_STEPS } from '@shared/config/routes';
import { useViewerState } from '@shared/viewer/hooks';

export const Registration = (): React.JSX.Element => {
  const { isAuthenticated } = useViewerState();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: ONBOARDING_STEPS.INIT });
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className="flex flex-1 items-center justify-center flex-col">
      <Outlet />
    </div>
  );
};
