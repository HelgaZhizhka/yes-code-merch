import { Link } from '@tanstack/react-router';

import {
  ClassNamesOutlineLinkButton,
  ClassNamesPrimaryLinkButton,
} from '@shared/config';
import { ROUTES } from '@shared/config/routes';
import { ListsView } from '@shared/model/constants';
import type { ListsViewType } from '@shared/model/types';

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
          : ClassNamesOutlineLinkButton
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
          : ClassNamesPrimaryLinkButton
      }
    >
      Sign up
    </Link>
  </>
);
