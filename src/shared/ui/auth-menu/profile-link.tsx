import { Link } from '@tanstack/react-router';
import { User } from 'lucide-react';

import { ROUTES } from '@shared/config/routes';
import { ListsView } from '@shared/model/constants';
import type { ListsViewType } from '@shared/model/types';

export const ProfileLink = ({
  variant,
}: {
  variant: ListsViewType;
}): React.JSX.Element =>
  variant === ListsView.VERTICAL ? (
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
