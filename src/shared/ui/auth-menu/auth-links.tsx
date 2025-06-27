import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import { LayoutView, type LayoutViewType } from '@shared/types';
import { getLinkButtonClass } from '@shared/ui/link-button';

import { Separator } from './separator';

export const AuthLinks = ({
  variant,
}: {
  variant: LayoutViewType;
}): React.JSX.Element => (
  <>
    <Link
      to={ROUTES.LOGIN}
      className={getLinkButtonClass(
        variant === LayoutView.FOOTER ? 'white' : 'outline'
      )}
    >
      Sign in
    </Link>
    {variant === LayoutView.FOOTER && <Separator />}
    <Link
      to={ROUTES.REGISTRATION}
      className={getLinkButtonClass(
        variant === LayoutView.FOOTER ? 'white' : 'primary'
      )}
    >
      Sign up
    </Link>
  </>
);
