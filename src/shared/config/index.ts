export const config = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ?? '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
};
export const RootElementId = 'app';
export const RootElementClassNames = 'min-h-screen flex flex-col';
export const CATEGORIES = ['Clothes', 'DrinkWare', 'Office', 'Bags'];
export const SaleCategoryName = 'T-Shirts';
export const RpcFunctions = {
  registration: 'complete_registration',
} as const;
