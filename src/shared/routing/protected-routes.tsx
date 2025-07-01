import { Navigate } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { Login } from '@pages/login';
import { Profile } from '@pages/profile';
import { Registration } from '@pages/registration';

import { ROUTES } from '@shared/config/routes';
import { useIsAuthorized, useIsSessionLoaded } from '@shared/session/model';

interface AuthGuardProps {
  children: ReactNode;
  guard: 'authorized' | 'guest';
}

export const AuthGuard = ({ children, guard }: AuthGuardProps) => {
  const isAuthorized = useIsAuthorized();
  const isSessionLoaded = useIsSessionLoaded();

  if (!isSessionLoaded) {
    return;
  }

  if (guard === 'authorized' && !isAuthorized) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  } else if (guard === 'guest' && isAuthorized) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

export const ProtectedLogin = () => (
  <AuthGuard guard="guest">
    <Login />
  </AuthGuard>
);

export const ProtectedProfile = () => (
  <AuthGuard guard="authorized">
    <Profile />
  </AuthGuard>
);

export const ProtectedRegistration = () => (
  <AuthGuard guard="guest">
    <Registration />
  </AuthGuard>
);
