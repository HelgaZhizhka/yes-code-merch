import { ActiveFilters } from '@features/active-filters';
import { AddToCart } from '@features/add-to-cart';
import { PaginateCatalog } from '@features/paginate-catalog';

import {
  CatalogList,
  useCatalogProducts,
  useCatalogSearch,
} from '@entities/catalog';

import { cn } from '@shared/lib/utils';

import { CatalogEmptyState } from '../catalog-empty-state';
import { CatalogFiltersSheet } from '../catalog-filters-sheet';
import { ContentSkeleton } from '../catalog-skeleton';

interface CatalogContentProps {
  categoryIds: string[] | null;
}

export const CatalogContent = ({
  categoryIds,
}: CatalogContentProps): React.JSX.Element | null => {
  const { searchParams } = useCatalogSearch();

  const query = useCatalogProducts({
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
        <ActiveFilters />
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
            <CatalogList
              products={products}
              renderActions={() => <AddToCart variant="catalog" />}
            />
          </div>
          <PaginateCatalog meta={meta} />
        </>
      )}
    </div>
  );
};
