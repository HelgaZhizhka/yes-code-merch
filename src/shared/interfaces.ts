export interface BeforeLoadContext {
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
