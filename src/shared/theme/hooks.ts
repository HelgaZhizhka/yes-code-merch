import { useEffect } from 'react';

import { useThemeStore } from '@shared/theme/model/store';
import { Theme } from '@shared/theme/types';

export const useTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    document.documentElement.classList.toggle(Theme.DARK, theme === Theme.DARK);
  }, [theme]);

  return { theme, setTheme };
};
