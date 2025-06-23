import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import { ListsView, type ListsViewType } from '@shared/types';
import {
  classNamesOutlineLinkButton,
  classNamesPrimaryLinkButton,
} from '@shared/ui/button';

import { Separator } from './separator';

export const AuthLinks = ({
  variant,
}: {
  variant: ListsViewType;
}): React.JSX.Element => (
  <>
    <Link
      to={ROUTES.LOGIN}
      className={
        variant === ListsView.VERTICAL
          ? 'text-violet-foreground hover:text-primary-foreground'
          : classNamesOutlineLinkButton
      }
    >
      Sign in
    </Link>
    {variant === ListsView.VERTICAL && <Separator />}
    <Link
      to={ROUTES.REGISTRATION}
      className={
        variant === ListsView.VERTICAL
          ? 'text-violet-foreground hover:text-primary-foreground'
          : classNamesPrimaryLinkButton
      }
    >
      Sign up
    </Link>
  </>
);
