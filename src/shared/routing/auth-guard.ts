import { redirect } from '@tanstack/react-router';

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

export interface AuthGuardProps {
  requireAuth?: boolean;
  redirectTo: string;
}

export const authGuard = ({ requireAuth, redirectTo }: AuthGuardProps) => {
  return (opts: BeforeLoadContext) => {
    const { status } = opts.context ?? { status: ViewerStatus.INITIAL };

    if (opts?.preload) return;

    if (status === ViewerStatus.INITIAL || status === ViewerStatus.LOADING) {
      return;
    }

    const isAuthenticated = status === ViewerStatus.AUTHENTICATED;

    if (requireAuth && !isAuthenticated) {
      throw redirect({ to: redirectTo });
    }

    if (!requireAuth && isAuthenticated) {
      throw redirect({ to: redirectTo });
    }
  };
};
