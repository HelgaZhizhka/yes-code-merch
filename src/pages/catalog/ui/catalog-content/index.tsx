import { ProductList, useCatalogSearch, useProducts } from '@entities/product';

import { cn } from '@shared/lib/utils';

import { CatalogActiveFilters } from '../catalog-active-filters';
import { CatalogEmptyState } from '../catalog-empty-state';
import { CatalogFiltersSheet } from '../catalog-filters-sheet';
import { CatalogPagination } from '../catalog-pagination';
import { ContentSkeleton } from '../catalog-skeleton';

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
    return <ContentSkeleton />;
  }

  const { data: products, meta } = query.data;
  const isFetching = query.isFetching;
  const isEmpty = meta.totalCount === 0;

  return (
    <div className="flex flex-1 flex-col" aria-busy={isFetching}>
      <div className="mb-3 flex flex-wrap items-center gap-2 lg:hidden">
        <CatalogFiltersSheet categoryIds={categoryIds} />
        <CatalogActiveFilters />
      </div>

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
            <ProductList products={products} />
          </div>
          <CatalogPagination meta={meta} />
        </>
      )}
    </div>
  );
};
