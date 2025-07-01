import { redirect } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import {
  isAuthorized,
  isSessionLoaded,
  useSessionStore,
} from '@shared/session/model';

interface BeforeLoadContext {
  preload?: boolean;
  context?: unknown;
  location?: {
    pathname: string;
    search: Record<string, unknown>;
    searchStr: string;
    state: unknown;
    hash: string;
  };
}
type AuthGuardType = 'authorized' | 'guest';

export function createAuthGuard(type: AuthGuardType) {
  return async (opts: BeforeLoadContext) => {
    if (opts?.preload) return;
    if (!isSessionLoaded()) {
      await new Promise((resolve) => {
        const unsub = useSessionStore.subscribe((state) => {
          if (state.isSessionLoaded) {
            unsub();
            resolve(true);
          }
        });
      });
    }
    if (type === 'authorized' && !isAuthorized()) {
      throw redirect({ to: ROUTES.LOGIN });
    }
    if (type === 'guest' && isAuthorized()) {
      throw redirect({ to: ROUTES.HOME });
    }
  };
}
