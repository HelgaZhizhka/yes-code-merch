export const ListsView = {
  DEFAULT: 'default',
  VERTICAL: 'vertical',
} as const;

export type ListsViewType = (typeof ListsView)[keyof typeof ListsView];
