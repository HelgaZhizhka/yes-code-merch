import { useMemo } from 'react';

import { useCatalogSearch, type PaginationMeta } from '@entities/product';

import {
  Pagination,
  PaginationContent,
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
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
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

        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
              {p}
            </PaginationLink>
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
