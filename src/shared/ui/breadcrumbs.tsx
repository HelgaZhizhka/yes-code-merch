import { Link } from '@tanstack/react-router';

import type { BreadcrumbItem } from '@shared/api';
import { ROUTES } from '@shared/config/routes';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({
  items,
  className,
}: BreadcrumbsProps): React.JSX.Element | null => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2">
        <li>
          <Link to={ROUTES.HOME}>Home</Link>
        </li>

        {items.map((item) => (
          <li
            key={item.path}
            className="flex items-center gap-2"
            aria-current={item.isCurrent ? 'page' : undefined}
          >
            <span>/</span>
            {item.isCurrent ? (
              <span>{item.name}</span>
            ) : (
              <Link to={ROUTES.CATEGORY} params={{ _splat: item.path }}>
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
