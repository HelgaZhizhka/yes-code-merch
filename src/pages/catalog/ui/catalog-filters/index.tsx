import { CATALOG_TEXT } from '@pages/catalog/lib';

import { useFilterOptions, useCatalogSearch } from '@entities/product';

import { FilterSection } from './filter-section';

import { CatalogActiveFilters } from '../catalog-active-filters';
import { CatalogColorFilter } from '../catalog-color-filter';
import { CatalogPriceFilter } from '../catalog-price-filter';
import { CatalogSizeFilter } from '../catalog-size-filter';

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

      <CatalogActiveFilters />

      {hasSizeFilter && (
        <FilterSection title={CATALOG_TEXT.size.title}>
          <CatalogSizeFilter available={sizes} />
        </FilterSection>
      )}

      <FilterSection title={CATALOG_TEXT.color.title}>
        <CatalogColorFilter available={colors} />
      </FilterSection>

      <FilterSection title={CATALOG_TEXT.price.title}>
        <CatalogPriceFilter bounds={{ min: priceMin, max: priceMax }} />
      </FilterSection>
    </div>
  );
};
