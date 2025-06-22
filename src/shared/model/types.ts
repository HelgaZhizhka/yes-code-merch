import type { ListsView, PhoneWidgetTypes } from './constants';

export type ListsViewType = (typeof ListsView)[keyof typeof ListsView];
export type PhoneWidgetType =
  (typeof PhoneWidgetTypes)[keyof typeof PhoneWidgetTypes];
