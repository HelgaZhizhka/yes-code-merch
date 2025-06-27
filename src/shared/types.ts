export const LayoutView = {
  HEADER: 'header',
  FOOTER: 'footer',
} as const;

export type LayoutViewType = (typeof LayoutView)[keyof typeof LayoutView];
