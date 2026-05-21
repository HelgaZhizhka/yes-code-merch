import { useNavigate, useSearch } from '@tanstack/react-router';

import type { FilterTag } from './types';

import {
  catalogSearchSchema,
  type CatalogSearch,
} from '../lib/catalog-search-schema';

const toggleInArray = (
  array: string[] | undefined,
  value: string
): string[] => {
  const current = array ?? [];
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
};

export const useCatalogSearch = () => {
  const navigate = useNavigate();
  const searchParams = catalogSearchSchema.parse(useSearch({ strict: false }));

  const updateSearch = (
    updates: Partial<CatalogSearch>,
    options?: { resetScroll?: boolean }
  ): void => {
    navigate({
      to: '.',
      search: (prev: Record<string, unknown>) => ({
        ...catalogSearchSchema.parse(prev),
        ...updates,
      }),
      resetScroll: options?.resetScroll ?? true,
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

  const toggleColor = (color: string): void => {
    updateSearch({
      colors: toggleInArray(searchParams.colors, color),
      page: 1,
    });
  };

  const toggleSize = (size: string): void => {
    updateSearch({
      sizes: toggleInArray(searchParams.sizes, size),
      page: 1,
    });
  };

  const setColors = (colors: string[]): void => {
    updateSearch({ colors, page: 1 });
  };

  const setSizes = (sizes: string[]): void => {
    updateSearch({ sizes, page: 1 });
  };

  const removeFilter = ({ type, value }: FilterTag): void => {
    if (type === 'color') {
      updateSearch({
        colors: (searchParams.colors ?? []).filter((c) => c !== value),
        page: 1,
      });
    } else {
      updateSearch({
        sizes: (searchParams.sizes ?? []).filter((s) => s !== value),
        page: 1,
      });
    }
  };

  const resetFilters = (): void => {
    updateSearch({
      colors: undefined,
      sizes: undefined,
      priceMin: undefined,
      priceMax: undefined,
      page: 1,
    });
  };

  return {
    searchParams,
    updateSearch,
    setPage,
    setSearchQuery,
    setSorting,
    setPriceRange,
    toggleColor,
    toggleSize,
    setColors,
    setSizes,
    removeFilter,
    resetFilters,
  };
};
