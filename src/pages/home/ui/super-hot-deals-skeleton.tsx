import { makeSkeletonKeys } from '@shared/lib/skeleton-keys';

const CARD_KEYS = makeSkeletonKeys('deal', 5);

export const SuperHotDealsSkeleton = (): React.JSX.Element => {
  return (
    <section
      aria-busy="true"
      aria-label="Loading hot deals"
      className="container mx-auto px-4 py-6"
    >
      <div className="mb-2 h-8 w-72 animate-pulse rounded bg-muted" />
      <div className="mb-6 h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {CARD_KEYS.map((key) => (
          <div
            key={key}
            className="aspect-[3/4] w-full animate-pulse rounded bg-muted"
          />
        ))}
      </div>
    </section>
  );
};
