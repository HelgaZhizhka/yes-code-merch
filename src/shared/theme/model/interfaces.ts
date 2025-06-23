import type { ThemeType } from './types';

export interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}
