import { cva } from 'class-variance-authority';

import { cn } from '@shared/lib/utils';
import { LayoutView, type LayoutViewType } from '@shared/types';

import { AuthLinks } from './auth-links';
import { LogoutButton } from './logout-button';
import { ProfileLink } from './profile-link';
import { Separator } from './separator';

interface AuthMenuProps {
  isAuthorized: boolean;
  isLoaded: boolean;
  variant?: LayoutViewType;
  onLogout(): void;
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
  isAuthorized,
  isLoaded,
  variant = LayoutView.HEADER,
  onLogout,
}: AuthMenuProps): React.JSX.Element | null => {
  if (!isLoaded) return null;

  return (
    <nav className={cn(containerVariants({ variant }))}>
      {isAuthorized ? (
        <>
          <ProfileLink variant={variant} />
          {variant === LayoutView.FOOTER && <Separator />}
          <LogoutButton variant={variant} onLogout={onLogout} />
        </>
      ) : (
        <AuthLinks variant={variant} />
      )}
    </nav>
  );
};
