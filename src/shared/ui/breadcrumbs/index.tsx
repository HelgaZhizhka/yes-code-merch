import { Link } from '@tanstack/react-router';

import { useCategoryBreadcrumbPaths } from '@shared/api/categories/hooks';
import { ROUTES } from '@shared/config/routes';

export const Breadcrumbs = ({ splat }: { splat: string }) => {
  const slug = splat.split('/').at(-1) ?? '';
  const { data: items = [] } = useCategoryBreadcrumbPaths(slug);
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to={ROUTES.HOME}>Home</Link>
        </li>
        {items.map((item) => (
          <li
            key={item.path}
            aria-current={item.isCurrent ? 'page' : undefined}
          >
            {item.isCurrent ? (
              <span>{item.name}</span>
            ) : (
              <Link
                to={ROUTES.CATEGORY}
                params={{ _splat: item.path }}
                preload="intent"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
