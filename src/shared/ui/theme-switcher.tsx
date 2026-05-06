import { MoonStar, Sun } from 'lucide-react';

import { useTheme } from '@shared/theme/hooks';
import { Theme } from '@shared/theme/types';

export const ThemeSwitcher = (): React.JSX.Element => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === Theme.DARK;

  return (
    <button
      className="text-foreground hover:text-primary transition-all"
      onClick={() => setTheme(isDark ? Theme.LIGHT : Theme.DARK)}
    >
      {isDark ? <Sun className="size-7" /> : <MoonStar className="size-7" />}
    </button>
  );
};
