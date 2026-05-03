import { SlidersHorizontal } from 'lucide-react';
import { Suspense, useState } from 'react';

import { CATALOG_TEXT } from '@pages/catalog/lib';

import { useCatalogSearch } from '@entities/product';

import { useCategoriesTree } from '@shared/api';
import { CategoriesTree } from '@shared/ui/categories-tree';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@shared/ui/sheet';

import { CatalogFilters } from './catalog-filters';
import { FilterSection } from './catalog-filters/filter-section';

interface CatalogFiltersSheetProps {
  categoryIds: string[];
}

const SheetFiltersContent = ({
  categoryIds,
}: {
  categoryIds: string[];
}): React.JSX.Element => {
  const { data: categoryTree } = useCategoriesTree();
  return (
    <>
      <FilterSection title={CATALOG_TEXT.categories.title} defaultOpen>
        <CategoriesTree categoryTree={categoryTree} variant="sidebar" />
      </FilterSection>
      <CatalogFilters categoryIds={categoryIds} />
    </>
  );
};

export const CatalogFiltersSheet = ({
  categoryIds,
}: CatalogFiltersSheetProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const { searchParams } = useCatalogSearch();

  const activeCount =
    (searchParams.colors?.length ?? 0) +
    (searchParams.sizes?.length ?? 0) +
    (searchParams.priceMin !== undefined || searchParams.priceMax !== undefined
      ? 1
      : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 rounded-sm border border-border px-3 h-8 text-sm font-medium transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {CATALOG_TEXT.filters.title}
          {activeCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] overflow-y-auto rounded-t-xl px-4 pt-2 pb-8"
      >
        <SheetHeader className="pb-2">
          <SheetTitle>{CATALOG_TEXT.filters.title}</SheetTitle>
        </SheetHeader>
        <Suspense fallback={null}>
          <SheetFiltersContent categoryIds={categoryIds} />
        </Suspense>
      </SheetContent>
    </Sheet>
  );
};
