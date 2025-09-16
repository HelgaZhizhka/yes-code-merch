import { Link } from '@tanstack/react-router';
import { cva } from 'class-variance-authority';
import type React from 'react';

import { useRootCategories } from '@shared/api/categories/hooks';
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
      footer: 'text-violet-foreground hover:text-violet-accent-foreground',
    },
  },
  defaultVariants: {
    variant: 'header',
  },
});

export const Categories = ({
  variant = LayoutView.HEADER,
}: CategoriesProps): React.JSX.Element | null => {
  const categories = useRootCategories();

  return (
    <ul className={cn(containerVariants({ variant }))}>
      {categories.map((category) => {
        const { name, slug } = category;
        return (
          <li key={name}>
            <Link
              to={ROUTES.CATEGORY}
              params={{ categoryId: slug }}
              className={cn(linkVariants({ variant }))}
            >
              {name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
