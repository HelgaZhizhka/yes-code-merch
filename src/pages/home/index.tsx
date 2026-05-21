import { Suspense } from 'react';

import { NAV_SKELETON_KEYS } from '@shared/lib/skeleton-keys';
import { Categories } from '@shared/ui/categories';

import { SuperHotDeals } from './ui/super-hot-deals';
import { SuperHotDealsSkeleton } from './ui/super-hot-deals-skeleton';
import { USPSection } from './ui/usp-section';

export const Home = (): React.JSX.Element => {
  return (
    <div className="flex flex-1 flex-col items-center justify-between p-4">
      <div className="flex flex-col items-center gap-4 w-full">
        <h2 className="text-2xl">Shop by category</h2>
        <Suspense
          fallback={
            <div className="flex flex-wrap justify-center gap-4 w-full">
              {NAV_SKELETON_KEYS.map((key) => (
                <div
                  key={key}
                  className="h-32 w-40 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          }
        >
          <Categories />
        </Suspense>
      </div>

      <Suspense fallback={<SuperHotDealsSkeleton />}>
        <SuperHotDeals />
      </Suspense>

      <USPSection />
    </div>
  );
};
