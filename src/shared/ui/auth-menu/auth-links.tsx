import { Link } from '@tanstack/react-router';

import { REGISTRATION_STEPS, ROUTES } from '@shared/config/routes';
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
        variant === LayoutView.FOOTER ? 'white' : 'outline',
        variant === LayoutView.FOOTER ? 'sm' : 'xl'
      )}
    >
      Sign in
    </Link>
    {variant === LayoutView.FOOTER && <Separator />}
    <Link
      to={REGISTRATION_STEPS.INIT}
      className={getLinkButtonClass(
        variant === LayoutView.FOOTER ? 'white' : 'primary',
        variant === LayoutView.FOOTER ? 'sm' : 'xl'
      )}
    >
      Sign up
    </Link>
  </>
);
