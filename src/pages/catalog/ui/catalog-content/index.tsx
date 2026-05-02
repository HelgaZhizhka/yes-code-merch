import { ProductList, useCatalogSearch, useProducts } from '@entities/product';

import { cn } from '@shared/lib/utils';

import { CatalogEmptyState } from '../catalog-empty-state';
import { CatalogHeader } from '../catalog-header';
import { CatalogPagination } from '../catalog-pagination';

interface CatalogContentProps {
  categoryIds: string[] | null;
}

export const CatalogContent = ({
  categoryIds,
}: CatalogContentProps): React.JSX.Element | null => {
  const { searchParams } = useCatalogSearch();

  const query = useProducts({
    categoryIds: categoryIds ?? [],
    ...searchParams,
  });

  if (!categoryIds || categoryIds.length === 0) {
    return null;
  }

  if (!query.data) {
    return null;
  }

  const { data: products, meta } = query.data;
  const isFetching = query.isFetching;
  const isEmpty = meta.totalCount === 0;

  return (
    <div className="flex flex-1 flex-col" aria-busy={isFetching}>
      <CatalogHeader totalCount={meta.totalCount} />

      {isEmpty ? (
        <CatalogEmptyState />
      ) : (
        <>
          <div
            className={cn(
              'transition-opacity',
              isFetching && 'opacity-60 pointer-events-none'
            )}
          >
            <ProductList products={products} view={searchParams.view} />
          </div>
          <CatalogPagination meta={meta} />
        </>
      )}
    </div>
  );
};
