export const config = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ?? '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  HOST: import.meta.env.VITE_HOST ?? 'http://localhost:3000',
};
export const RootElementId = 'app';
export const RootElementClassNames = 'min-h-screen flex flex-col';
export const SaleCategoryName = 'T-Shirts';
export const RpcFunctions = {
  registration: 'complete_registration',
  setDefaultAddress: 'set_default_address',
  clearDefaultAddress: 'clear_default_address',
} as const;
