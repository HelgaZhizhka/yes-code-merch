export const config = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};
export const RootElementId = 'app';
export const RootElementClassNames = 'min-h-screen flex flex-col';
export const SaleCategoryName = 'T-Shirts';
export const ClassNamesPrimaryLinkButton =
  'inline-flex items-center h-10 text-xl font-medium px-6 rounded-md bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 transition-all';
export const ClassNamesOutlineLinkButton =
  'inline-flex items-center h-10 text-xl font-medium px-6 rounded-md text-primary-foreground border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 transition-all';
