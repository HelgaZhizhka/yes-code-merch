import { makeSkeletonKeys } from '@shared/lib/skeleton-keys';

const CARD_KEYS = makeSkeletonKeys('deal', 5);

export const SuperHotDealsSkeleton = (): React.JSX.Element => {
  return (
    <section
      aria-busy="true"
      aria-label="Loading hot deals"
      className="mx-auto max-w-[1020px] px-4 py-6"
    >
      <div className="mb-2 h-8 w-72 animate-pulse rounded bg-muted" />
      <div className="mb-6 h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
      <ul
        aria-label="Loading discounted products"
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0"
      >
        {CARD_KEYS.map((key) => (
          <li key={key} className="w-[260px] shrink-0 snap-start">
            <div className="aspect-[3/4] w-full animate-pulse rounded bg-muted" />
          </li>
        ))}
      </ul>
    </section>
  );
};
