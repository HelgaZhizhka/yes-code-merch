import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ThemeState } from './interfaces';
import { ThemeEnum } from './types';

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: ThemeEnum.Light,
      setTheme: (theme) => {
        set({ theme });
      },
    }),
    {
      name: 'theme',
    }
  )
);
