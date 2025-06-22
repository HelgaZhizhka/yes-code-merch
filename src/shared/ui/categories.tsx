import { Link } from '@tanstack/react-router';
import type React from 'react';

import { ROUTES } from '@shared/config/routes';
import { cn } from '@shared/lib/utils';
import { CATEGORIES, ListsView } from '@shared/model/constants';
import type { ListsViewType } from '@shared/model/types';

interface CategoriesProps {
  variant?: ListsViewType;
}

const containerVariants: Record<ListsViewType, string> = {
  default: 'flex gap-12 text-2xl',
  vertical: 'space-y-1',
};

const linkVariants: Record<ListsViewType, string> = {
  default: 'text-secondary-foreground hover:text-primary transition',
  vertical: 'text-violet-foreground hover:text-primary-foreground',
};

export const Categories = ({
  variant = ListsView.DEFAULT,
}: CategoriesProps): React.JSX.Element => {
  return (
    <ul className={cn(containerVariants[variant])}>
      {CATEGORIES.map((cat) => (
        <li key={cat}>
          <Link
            to={ROUTES.CATEGORY}
            params={{ categoryId: cat.toLowerCase() }}
            className={cn(linkVariants[variant])}
          >
            {cat}
          </Link>
        </li>
      ))}
    </ul>
  );
};
