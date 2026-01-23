import { useParams } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useCategoryData } from '@shared/api';
import { Breadcrumbs } from '@shared/ui/breadcrumbs';

import { ErrorFallback } from './error';
import { CatalogContent } from './ui/catalog-content';
import { SideBar } from './ui/sidebar';

export const Catalog = (): React.JSX.Element => {
  const { _splat } = useParams({ strict: false });
  const { breadcrumbs, categoryIds, tree } = useCategoryData(_splat);

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="flex gap-6">
            <SideBar categoryTree={tree} />
            <CatalogContent categoryIds={categoryIds} />
          </div>
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};
