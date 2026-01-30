import { useNavigate, useSearch } from '@tanstack/react-router';

import type { CatalogSearch } from '../lib/catalog-search-schema';

export const useCatalogSearch = () => {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as CatalogSearch;

  const updateSearch = (
    updates: Partial<CatalogSearch>,
    options?: { resetScroll?: boolean; replace?: boolean }
  ): void => {
    navigate({
      to: '.',
      search: (prev: CatalogSearch) => ({ ...prev, ...updates }),
      resetScroll: options?.resetScroll ?? true,
      replace: options?.replace ?? false,
    });
  };

  const resetSearch = (): void => {
    navigate({
      to: '.',
      search: {},
      resetScroll: true,
    });
  };

  const setPage = (page: number): void => {
    updateSearch({ page });
  };

  const setSearchQuery = (search: string): void => {
    updateSearch({ search, page: 1 });
  };

  const setSorting = (
    sortField: CatalogSearch['sortField'],
    sortDirection?: CatalogSearch['sortDirection']
  ): void => {
    updateSearch({
      sortField,
      ...(sortDirection && { sortDirection }),
      page: 1,
    });
  };

  const setPriceRange = (priceMin?: number, priceMax?: number): void => {
    updateSearch({ priceMin, priceMax, page: 1 });
  };

  return {
    searchParams,
    updateSearch,
    resetSearch,
    setPage,
    setSearchQuery,
    setSorting,
    setPriceRange,
  };
};
