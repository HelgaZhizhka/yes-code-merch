import { redirect } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import type { SessionContext } from '@shared/session/model';

type AuthMode = 'authorized' | 'guest';

export interface BeforeLoadContext {
  preload?: boolean;
  context?: SessionContext;
  location?: {
    pathname: string;
    search: Record<string, unknown>;
    searchStr: string;
    state: unknown;
    hash: string;
  };
}

export const authGuard = (mode: AuthMode) => {
  return (opts: BeforeLoadContext) => {
    const { isSessionLoaded, isAuthorized } = opts.context ?? {};

    if (opts?.preload) return;

    if (!isSessionLoaded) {
      return;
    }

    if (mode === 'authorized' && !isAuthorized) {
      throw redirect({ to: ROUTES.LOGIN });
    }

    if (mode === 'guest' && isAuthorized) {
      throw redirect({ to: ROUTES.HOME });
    }
  };
};
