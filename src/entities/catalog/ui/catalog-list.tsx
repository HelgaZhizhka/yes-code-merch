import type { ReactNode } from 'react';

import { CatalogCard } from './catalog-card';

import type { CatalogProduct } from '../model/types';

interface CatalogListProps {
  products: CatalogProduct[];
  renderActions?: (product: CatalogProduct) => ReactNode;
}

export const CatalogList = ({
  products,
  renderActions,
}: CatalogListProps): React.JSX.Element => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <CatalogCard
          key={product.productId}
          product={product}
          actions={renderActions?.(product)}
        />
      ))}
    </div>
  );
};
