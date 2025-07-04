import { redirect } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import { ViewerStatus, type ViewerStatusType } from '@shared/viewer';

export interface BeforeLoadContext {
  preload?: boolean;
  context?: {
    status: ViewerStatusType;
    queryClient?: unknown;
  };
  location?: {
    pathname: string;
    search: Record<string, unknown>;
    searchStr: string;
    state: unknown;
    hash: string;
  };
}

export type AuthMode = 'authorized' | 'guest';

export const authGuard = (mode: 'authorized' | 'guest') => {
  return (opts: BeforeLoadContext) => {
    const { status } = opts.context ?? { status: ViewerStatus.INITIAL };

    if (opts?.preload) return;

    if (status === ViewerStatus.INITIAL || status === ViewerStatus.LOADING) {
      return;
    }

    if (mode === 'authorized' && status !== ViewerStatus.AUTHENTICATED) {
      throw redirect({ to: ROUTES.LOGIN });
    }

    if (mode === 'guest' && status === ViewerStatus.AUTHENTICATED) {
      throw redirect({ to: ROUTES.HOME });
    }
  };
};
