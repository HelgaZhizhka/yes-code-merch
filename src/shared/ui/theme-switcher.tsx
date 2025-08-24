import { MoonStar, Sun } from 'lucide-react';

import { useTheme } from '@shared/theme/hooks';
import { Theme } from '@shared/theme/types';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === Theme.DARK;

  return (
    <button
      className="text-secondary-foreground hover:text-primary transition-all"
      onClick={() => setTheme(isDark ? Theme.LIGHT : Theme.DARK)}
    >
      {isDark ? <Sun className="w-9 h-9" /> : <MoonStar className="w-9 h-9" />}
    </button>
  );
};
