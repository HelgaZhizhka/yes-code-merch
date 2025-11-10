import type { QueryClient } from '@tanstack/react-query';

export interface AppRouterContext {
  status: string;
  queryClient: QueryClient;
}

export interface BeforeLoadContext {
  preload?: boolean;
  context?: AppRouterContext;
  location?: {
    pathname: string;
    search: Record<string, unknown>;
    searchStr: string;
    state: unknown;
    hash: string;
  };
}
