import { Link } from '@tanstack/react-router';
import type React from 'react';
import { ROUTES } from '@shared/routing/types';

export const Categories = (): React.JSX.Element => {
  const catArray = ['Clothes', 'DrinkWare', 'Office', 'Bags'];

  return (
    <nav className="flex gap-12 text-2xl">
      {catArray.map((cat) => (
        <Link
          to={ROUTES.CATEGORY}
          params={{ categoryId: cat.toLowerCase() }}
          key={cat}
          className="text-secondary-foreground"
        >
          {cat}
        </Link>
      ))}
    </nav>
  );
};
