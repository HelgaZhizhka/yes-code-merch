import { Link } from '@tanstack/react-router';
import { cva } from 'class-variance-authority';
import type React from 'react';

import { CATEGORIES } from '@shared/config';
import { ROUTES } from '@shared/config/routes';
import { cn } from '@shared/lib/utils';
import { LayoutView, type LayoutViewType } from '@shared/types';

interface CategoriesProps {
  variant?: LayoutViewType;
}

const containerVariants = cva('', {
  variants: {
    variant: {
      header: 'flex gap-12 text-2xl',
      footer: 'space-y-1',
    },
  },
  defaultVariants: {
    variant: 'header',
  },
});

const linkVariants = cva('transition-all', {
  variants: {
    variant: {
      header: 'text-secondary-foreground hover:text-primary',
      footer: 'text-violet-foreground hover:text-primary-foreground',
    },
  },
  defaultVariants: {
    variant: 'header',
  },
});

export const Categories = ({
  variant = LayoutView.HEADER,
}: CategoriesProps): React.JSX.Element => {
  return (
    <ul className={cn(containerVariants({ variant }))}>
      {CATEGORIES.map((cat) => (
        <li key={cat}>
          <Link
            to={ROUTES.CATEGORY}
            params={{ categoryId: cat.toLowerCase() }}
            className={cn(linkVariants({ variant }))}
          >
            {cat}
          </Link>
        </li>
      ))}
    </ul>
  );
};
