import { redirect } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import type { BeforeLoadContext } from '@shared/model/interfaces';
import { isAuthorized, isSessionLoaded } from '@shared/viewer/model/selectors';
import { useSessionStore } from '@shared/viewer/model/store';

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
