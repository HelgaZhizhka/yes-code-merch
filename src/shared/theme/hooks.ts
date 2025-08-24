import { useEffect } from 'react';

import { setTheme, useThemeValue } from '@shared/theme/model';
import { Theme } from '@shared/theme/types';

export const useTheme = () => {
  const theme = useThemeValue();

  useEffect(() => {
    document.documentElement.classList.toggle(Theme.DARK, theme === Theme.DARK);
  }, [theme]);

  return { theme, setTheme };
};
