import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Theme, type ThemeType } from '@shared/theme/types';

export interface ThemeState {
  theme: ThemeType;
  setTheme(theme: ThemeType): void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: Theme.LIGHT,
      setTheme: (theme) => {
        set({ theme });
      },
    }),
    {
      name: 'theme',
    }
  )
);
