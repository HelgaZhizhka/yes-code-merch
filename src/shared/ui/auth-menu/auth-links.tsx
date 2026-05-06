import { Link } from '@tanstack/react-router';
import { LogIn, UserPlus } from 'lucide-react';

import { ROUTES } from '@shared/config/routes';
import { cn } from '@shared/lib/utils';
import { LayoutView, type LayoutViewType } from '@shared/types';
import { getLinkButtonClass } from '@shared/ui/link-button';

import { Separator } from './separator';

export const AuthLinks = ({
  variant,
}: {
  variant: LayoutViewType;
}): React.JSX.Element =>
  variant === LayoutView.FOOTER ? (
    <>
      <Link to={ROUTES.LOGIN} className={getLinkButtonClass('white', 'sm')}>
        Sign in
      </Link>
      <Separator />
      <Link
        to={ROUTES.REGISTRATION}
        className={getLinkButtonClass('white', 'sm')}
      >
        Sign up
      </Link>
    </>
  ) : (
    <>
      <Link
        to={ROUTES.LOGIN}
        className={cn(getLinkButtonClass('outline', 'xl'), 'max-sm:hidden')}
      >
        Sign in
      </Link>
      <Link
        to={ROUTES.REGISTRATION}
        className={cn(getLinkButtonClass('primary', 'xl'), 'max-sm:hidden')}
      >
        Sign up
      </Link>

      <Link
        to={ROUTES.LOGIN}
        aria-label="Sign in"
        className={cn(
          getLinkButtonClass('ghost', 'icon'),
          'text-foreground sm:hidden'
        )}
      >
        <LogIn className="size-7" aria-hidden="true" />
      </Link>
      <Link
        to={ROUTES.REGISTRATION}
        aria-label="Sign up"
        className={cn(
          getLinkButtonClass('ghost', 'icon'),
          'text-foreground sm:hidden'
        )}
      >
        <UserPlus className="size-7" aria-hidden="true" />
      </Link>
    </>
  );
