import { cn } from '@shared/lib/utils';

import { ProductCard } from './product-card';

import type { CatalogProduct } from '../api/types';
import type { CatalogView } from '../api/types';
import { CATALOG_VIEWS } from '../lib';

interface ProductListProps {
  products: CatalogProduct[];
  view?: CatalogView;
}

export const ProductList = ({
  products,
  view = CATALOG_VIEWS.GRID_4,
}: ProductListProps): React.JSX.Element => {
  return (
    <div
      className={cn(
        'grid gap-8',
        view === CATALOG_VIEWS.GRID_3
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
};
