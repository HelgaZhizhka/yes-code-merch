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

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => hasPreviousPage && setPage(page - 1)}
            className={hasPreviousPage ? '' : 'pointer-events-none opacity-50'}
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
            onClick={() => hasNextPage && setPage(page + 1)}
            className={hasNextPage ? '' : 'pointer-events-none opacity-50'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
