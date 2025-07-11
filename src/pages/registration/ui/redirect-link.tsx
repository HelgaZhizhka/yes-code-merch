import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import { getLinkButtonClass } from '@shared/ui/link-button';

export const RedirectLink = (): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        Already have an account?
        <div className="flex-1 h-px bg-border" />
      </div>
      <Link to={ROUTES.LOGIN} className={getLinkButtonClass('outline', 'sm')}>
        Sign in
      </Link>
    </div>
  );
};
