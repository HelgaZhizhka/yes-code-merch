export const LayoutView = {
  HEADER: 'header',
  FOOTER: 'footer',
  HOME: 'home',
} as const;

export type LayoutViewType = (typeof LayoutView)[keyof typeof LayoutView];
export type AuthLayoutViewType = Extract<LayoutViewType, 'header' | 'footer'>;
export type AsyncVoidFunction = () => Promise<void>;
