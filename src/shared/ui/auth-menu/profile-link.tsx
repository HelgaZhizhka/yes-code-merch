import { Link } from '@tanstack/react-router';
import { User } from 'lucide-react';

import { ROUTES } from '@shared/config/routes';
import { LayoutView, type LayoutViewType } from '@shared/types';

export const ProfileLink = ({
  variant,
}: {
  variant: LayoutViewType;
}): React.JSX.Element =>
  variant === LayoutView.FOOTER ? (
    <Link
      to={ROUTES.PROFILE}
      className="text-violet-foreground hover:text-primary-foreground"
    >
      Profile
    </Link>
  ) : (
    <Link to={ROUTES.PROFILE}>
      <User className="w-9 h-9 text-primary-foreground" />
    </Link>
  );
