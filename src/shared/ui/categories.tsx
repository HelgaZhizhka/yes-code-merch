import { Link } from '@tanstack/react-router';
import { cva } from 'class-variance-authority';
import type React from 'react';

import { useRootCategories } from '@shared/api/categories/hooks';
import Bags from '@shared/assets/bags.png';
import Clothes from '@shared/assets/clothes.png';
import Drinkware from '@shared/assets/drinkware.png';
import Office from '@shared/assets/office.png';
import Raccoon from '@shared/assets/Raccoon.svg';
import { ROUTES } from '@shared/config/routes';
import { cn } from '@shared/lib/utils';
import { LayoutView, type LayoutViewType } from '@shared/types';

interface CategoriesProps {
  variant?: LayoutViewType;
}

interface Asset {
  image: string;
  color: string;
  width: number;
  height: number;
}

const categoriesAssets: Record<string, Asset> = {
  clothes: {
    image: Clothes,
    color: 'var(--primary)',
    width: 160,
    height: 160,
  },
  drinkware: {
    image: Drinkware,
    color: 'var(--violet)',
    width: 160,
    height: 160,
  },
  office: {
    image: Office,
    color: 'var(--success)',
    width: 160,
    height: 160,
  },
  bags: {
    image: Bags,
    color: 'var(--secondary)',
    width: 160,
    height: 160,
  },
  default: {
    image: Raccoon,
    color: 'var(--muted-foreground)',
    width: 160,
    height: 160,
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
    <nav aria-label="Categories">
      <ul className={cn(containerVariants({ variant }))}>
        {categories.map((category) => {
          const { id, name, slug } = category;
          const assets = categoriesAssets[slug] ?? categoriesAssets.default;
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
                      className="shadow-block w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center mb-2 p-2 overflow-hidden"
                      style={
                        {
                          backgroundColor: assets.color,
                          '--shadow-color': assets.color,
                        } as React.CSSProperties
                      }
                    >
                      <img
                        src={assets.image}
                        alt={name}
                        width={assets.width}
                        height={assets.height}
                        className="w-4/5 h-4/5 object-contain"
                        loading="lazy"
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
    </nav>
  );
};
