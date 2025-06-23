import { useEffect } from 'react';

import { useThemeValue } from '@shared/theme/model/selectors';
import { ThemeEnum } from '@shared/theme/model/types';

export const ThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const theme = useThemeValue();

  useEffect(() => {
    document.documentElement.classList.toggle(
      ThemeEnum.Dark,
      theme === ThemeEnum.Dark
    );
  }, [theme]);

  return <>{children}</>;
};
