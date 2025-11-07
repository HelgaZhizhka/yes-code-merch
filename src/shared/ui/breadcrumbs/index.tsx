import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';

export const Breadcrumbs = () => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        <li>
          <Link to={ROUTES.HOME}>Home</Link>
        </li>
      </ol>
    </nav>
  );
};
