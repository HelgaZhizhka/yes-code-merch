import { cn } from '@shared/lib/utils';
import { ListsView, type ListsViewType } from '@shared/types';

import { AuthLinks } from './auth-links';
import { LogoutButton } from './logout-button';
import { ProfileLink } from './profile-link';
import { Separator } from './separator';

interface AuthMenuProps {
  isAuthorized: boolean;
  isLoaded: boolean;
  variant?: ListsViewType;
  onLogout(): void;
}

const containerVariants: Record<ListsViewType, string> = {
  default: 'flex gap-4 items-center',
  vertical: 'flex gap-2 items-center',
};

export const AuthMenu = ({
  isAuthorized,
  isLoaded,
  variant = ListsView.DEFAULT,
  onLogout,
}: AuthMenuProps): React.JSX.Element | null => {
  if (!isLoaded) return null;

  return (
    <nav className={cn(containerVariants[variant])}>
      {isAuthorized ? (
        <>
          <ProfileLink variant={variant} />
          <Separator />
          <LogoutButton variant={variant} onLogout={onLogout} />
        </>
      ) : (
        <AuthLinks variant={variant} />
      )}
    </nav>
  );
};
