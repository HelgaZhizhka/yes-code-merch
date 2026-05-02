import { SearchX } from 'lucide-react';

import { CATALOG_TEXT } from '@pages/catalog/lib';

import { useCatalogSearch } from '@entities/product';

export const CatalogEmptyState = (): React.JSX.Element => {
  const { resetFilters } = useCatalogSearch();

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-1 flex-col items-center justify-center gap-4 px-10 py-20 text-center"
    >
      <SearchX className="h-16 w-16 text-border" aria-hidden />
      <p className="text-xl font-bold text-foreground">
        {CATALOG_TEXT.empty.title}
      </p>
      <p className="max-w-[280px] text-sm leading-relaxed text-muted-foreground">
        {CATALOG_TEXT.empty.description}
      </p>
      <button
        type="button"
        onClick={resetFilters}
        className="mt-2 h-10 rounded-sm bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      >
        {CATALOG_TEXT.empty.cta}
      </button>
    </div>
  );
};
