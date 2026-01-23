import { useSearch } from '@tanstack/react-router';

import type { CatalogSearch } from '@entities/product';
import { ProductList, useProducts } from '@entities/product';

import { CatalogHeader } from '../catalog-header';

interface CatalogContentProps {
  categoryIds: string[] | null;
}

export const CatalogContent = ({
  categoryIds,
}: CatalogContentProps): React.JSX.Element | null => {
  const searchParams = useSearch({ strict: false }) as CatalogSearch;

  const {
    data: { data: products, meta },
  } = useProducts({
    categoryIds: categoryIds ?? [],
    ...searchParams,
  });

  if (!categoryIds || categoryIds.length === 0) {
    return null;
  }

  return (
    <div className="flex-1">
      <CatalogHeader totalCount={meta.totalCount} pageSize={meta.pageSize} />
      <ProductList products={products} />
    </div>
  );
};
