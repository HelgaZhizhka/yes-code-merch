import { Link } from '@tanstack/react-router';
import type React from 'react';

import { useCategoriesTree } from '@shared/api';
import Bags from '@shared/assets/bags.png';
import Clothes from '@shared/assets/clothes.png';
import Drinkware from '@shared/assets/drinkware.png';
import Office from '@shared/assets/office.png';
import Raccoon from '@shared/assets/Raccoon.svg';
import { ROUTES } from '@shared/config/routes';

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

export const Categories = (): React.JSX.Element => {
  const { data: categories } = useCategoriesTree();

  return (
    <nav aria-label="Categories">
      <ul className="flex gap-8 flex-wrap w-full justify-center">
        {categories.map((category) => {
          const { id, name, slug } = category;
          const assets = categoriesAssets[slug] ?? categoriesAssets.default;
          return (
            <li key={id}>
              <Link
                to={ROUTES.CATEGORY}
                preload="intent"
                params={{ _splat: slug }}
                className="flex flex-col items-center text-primary-foreground hover:text-primary text-center transition-all"
                activeProps={{
                  'data-active': true,
                  'aria-current': 'page',
                }}
              >
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
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
