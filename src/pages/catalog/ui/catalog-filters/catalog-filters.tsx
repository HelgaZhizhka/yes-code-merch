import { ActiveFilters } from '@features/active-filters';
import { FilterByColor } from '@features/filter-by-color';
import { FilterByPrice } from '@features/filter-by-price';
import { FilterBySize } from '@features/filter-by-size';

import {
  CATALOG_TEXT,
  useFilterOptions,
  useCatalogSearch,
} from '@entities/catalog';

import { FilterSection } from '@shared/ui/filter-section';

interface CatalogFiltersProps {
  categoryIds: string[];
}

export const CatalogFilters = ({
  categoryIds,
}: CatalogFiltersProps): React.JSX.Element => {
  const { resetFilters } = useCatalogSearch();
  const {
    data: { colors, sizes, priceMin, priceMax, hasSizeFilter },
  } = useFilterOptions(categoryIds);

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-foreground">
          {CATALOG_TEXT.filters.title}
        </span>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          {CATALOG_TEXT.filters.reset}
        </button>
      </div>

      <ActiveFilters />

      {hasSizeFilter && (
        <FilterSection title={CATALOG_TEXT.size.title}>
          <FilterBySize available={sizes} />
        </FilterSection>
      )}

      <FilterSection title={CATALOG_TEXT.color.title}>
        <FilterByColor available={colors} />
      </FilterSection>

      <FilterSection title={CATALOG_TEXT.price.title}>
        <FilterByPrice bounds={{ min: priceMin, max: priceMax }} />
      </FilterSection>
    </div>
  );
};
