import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { useTheme } from '@shared/theme/hooks';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'light' } = useTheme();
  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      closeButton
      richColors
      expand
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
