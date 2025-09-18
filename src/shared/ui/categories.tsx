import { Link } from '@tanstack/react-router';
import { cva } from 'class-variance-authority';
import type React from 'react';

import { useRootCategories } from '@shared/api/categories/hooks';
import Bags from '@shared/assets/bags.png';
import Clothes from '@shared/assets/clothes.png';
import Drinkware from '@shared/assets/drinkware.png';
import Office from '@shared/assets/office.png';
import { ROUTES } from '@shared/config/routes';
import { cn } from '@shared/lib/utils';
import { LayoutView, type LayoutViewType } from '@shared/types';

interface CategoriesProps {
  variant?: LayoutViewType;
}

const categoriesAssets: Record<string, { image: string; color: string }> = {
  clothes: {
    image: Clothes,
    color: 'var(--primary)',
  },
  drinkware: {
    image: Drinkware,
    color: 'var(--violet)',
  },
  office: {
    image: Office,
    color: 'var(--success)',
  },
  bags: {
    image: Bags,
    color: 'var(--secondary)',
  },
};

const containerVariants = cva('', {
  variants: {
    variant: {
      header: 'flex gap-12 text-2xl',
      footer: 'space-y-1',
      home: 'flex gap-8 flex-wrap w-full justify-center',
    },
  },
  defaultVariants: {
    variant: 'header',
  },
});

const linkVariants = cva('transition-all', {
  variants: {
    variant: {
      header:
        'text-secondary-foreground hover:text-primary data-[active=true]:text-primary',
      footer:
        'text-violet-foreground hover:text-violet-accent-foreground data-[active=true]:text-violet-accent-foreground',
      home: 'flex flex-col items-center text-primary-foreground hover:text-primary text-center',
    },
  },
  defaultVariants: {
    variant: 'header',
  },
});

export const Categories = ({
  variant = LayoutView.HEADER,
}: CategoriesProps): React.JSX.Element | null => {
  const { data: categories } = useRootCategories();

  return (
    <ul className={cn(containerVariants({ variant }))}>
      {categories.map((category) => {
        const { id, name, slug } = category;
        const assets = categoriesAssets[slug];
        return (
          <li key={id}>
            <Link
              to={ROUTES.CATEGORY}
              params={{ categoryId: slug }}
              className={cn(linkVariants({ variant }))}
              activeProps={{
                'data-active': true,
              }}
            >
              {variant === 'home' ? (
                <>
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center mb-2 p-2 overflow-hidden"
                    style={{ backgroundColor: assets.color }}
                  >
                    <img
                      src={assets.image}
                      alt={name}
                      className="w-4/5 h-4/5 object-contain"
                    />
                  </div>
                  <span>{name}</span>
                </>
              ) : (
                name
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
