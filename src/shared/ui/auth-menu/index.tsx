import { cva } from 'class-variance-authority';

import { cn } from '@shared/lib/utils';
import { LayoutView, type LayoutViewType } from '@shared/types';
import type { AuthProps } from '@shared/viewer';

import { AuthLinks } from './auth-links';
import { LogoutButton } from './logout-button';
import { ProfileLink } from './profile-link';
import { Separator } from './separator';

interface AuthMenuProps extends AuthProps {
  variant?: LayoutViewType;
  onLogout: () => Promise<void>;
}

const containerVariants = cva('flex items-center', {
  variants: {
    variant: {
      header: 'gap-4',
      footer: 'gap-2',
    },
  },
  defaultVariants: {
    variant: 'header',
  },
});

export const AuthMenu = ({
  variant = LayoutView.HEADER,
  isLoading,
  isGuest,
  isAuthenticated,
  isError,
  onLogout,
}: AuthMenuProps): React.JSX.Element | null => {
  if (isLoading) return null;

  return (
    <nav className={cn(containerVariants({ variant }))}>
      {isAuthenticated && (
        <>
          <ProfileLink variant={variant} />
          {variant === LayoutView.FOOTER && <Separator />}
          <LogoutButton variant={variant} onLogout={onLogout} />
        </>
      )}
      {(isGuest || isError) && <AuthLinks variant={variant} />}
    </nav>
  );
};
