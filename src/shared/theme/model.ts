import { createAppStore } from '@shared/lib/create-app-store';
import { Theme, type ThemeType } from '@shared/theme/types';

interface ThemeState {
  theme: ThemeType;
  setTheme(theme: ThemeType): void;
}

export const useThemeStore = createAppStore<ThemeState>(
  (set) => ({
    theme: Theme.LIGHT,
    setTheme: (theme) => {
      set({ theme });
    },
  }),
  {
    name: 'theme',
    enablePersist: true,
  }
);

export const useThemeValue = () => useThemeStore((state) => state.theme);

export const setTheme = (theme: ThemeType) =>
  useThemeStore.getState().setTheme(theme);
