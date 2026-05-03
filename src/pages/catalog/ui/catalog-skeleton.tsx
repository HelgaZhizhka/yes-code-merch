const CARD_SKELETON_KEYS = ['card-1', 'card-2', 'card-3', 'card-4'] as const;

const FilterSectionSkeleton = (): React.JSX.Element => (
  <div className="border-t border-border">
    <div className="flex items-center justify-between py-3">
      <div className="h-2.5 w-14 animate-pulse rounded bg-muted" />
      <div className="h-2.5 w-2.5 animate-pulse rounded bg-muted" />
    </div>
    <div className="flex flex-col gap-2 pb-3.5">
      <div className="h-2 w-full animate-pulse rounded bg-muted" />
      <div className="h-2 w-4/5 animate-pulse rounded bg-muted" />
      <div className="h-2 w-3/5 animate-pulse rounded bg-muted" />
    </div>
  </div>
);

export const SidebarSkeleton = (): React.JSX.Element => (
  <div className="hidden lg:flex w-[268px] shrink-0 flex-col">
    <FilterSectionSkeleton />
    <FilterSectionSkeleton />
    <FilterSectionSkeleton />
    <FilterSectionSkeleton />
  </div>
);

const CardSkeleton = (): React.JSX.Element => (
  <div className="flex flex-col gap-3">
    <div className="aspect-square animate-pulse rounded-lg bg-muted" />
    <div className="flex flex-col gap-2">
      <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
    </div>
  </div>
);

export const ContentSkeleton = (): React.JSX.Element => (
  <div className="flex flex-1 flex-col">
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {CARD_SKELETON_KEYS.map((key) => (
        <CardSkeleton key={key} />
      ))}
    </div>
  </div>
);
