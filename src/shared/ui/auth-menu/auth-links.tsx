import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import { ListsView, type ListsViewType } from '@shared/types';
import { getLinkButtonClass } from '@shared/ui/link-button';

import { Separator } from './separator';

export const AuthLinks = ({
  variant,
}: {
  variant: ListsViewType;
}): React.JSX.Element => (
  <>
    <Link
      to={ROUTES.LOGIN}
      className={getLinkButtonClass(
        variant === ListsView.VERTICAL ? 'simple' : 'outline'
      )}
    >
      Sign in
    </Link>
    {variant === ListsView.VERTICAL && <Separator />}
    <Link
      to={ROUTES.REGISTRATION}
      className={getLinkButtonClass(
        variant === ListsView.VERTICAL ? 'simple' : 'primary'
      )}
    >
      Sign up
    </Link>
  </>
);
