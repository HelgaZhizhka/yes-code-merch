import { useMemo } from 'react';

import { useCatalogSearch, type PaginationMeta } from '@entities/product';

import { getPageNumbers } from '@shared/lib/get-page-numbers';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@shared/ui/pagination';

interface CatalogPaginationProps {
  meta: PaginationMeta;
}

export const CatalogPagination = ({
  meta,
}: CatalogPaginationProps): React.JSX.Element | null => {
  const { setPage } = useCatalogSearch();
  const { page, totalPages, hasNextPage, hasPreviousPage } = meta;

  const pages = useMemo(
    () =>
      getPageNumbers({
        totalCount: totalPages,
        currentPage: page,
        siblingCount: 2,
      }),
    [page, totalPages]
  );

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={!hasPreviousPage}
            onClick={() => setPage(page - 1)}
          />
        </PaginationItem>

        {pages.map((p, index) => (
          <PaginationItem key={p === 'dots' ? `dots-${index}` : `page-${p}`}>
            {p === 'dots' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={p === page}
                disabled={p === page}
                onClick={() => setPage(p)}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            disabled={!hasNextPage}
            onClick={() => setPage(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
