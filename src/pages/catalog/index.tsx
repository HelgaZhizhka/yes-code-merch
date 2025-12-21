import { useParams } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useCategoryData } from '@shared/api';
import { Breadcrumbs } from '@shared/ui/breadcrumbs';

import { ErrorFallback } from './error';
import { CatalogList } from './ui/catalog-list';
import { SideBar } from './ui/sidebar';

import { useBreadcrumbs } from '@shared/api';
import { Breadcrumbs } from '@shared/ui/breadcrumbs';

import { SideBar } from './ui/sidebar';

export const Catalog = (): React.JSX.Element => {
  const { _splat } = useParams({ strict: false });
  const { breadcrumbs, categoryIds, tree } = useCategoryData(_splat);

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />
      <h1 className="mb-6 text-3xl font-bold">Catalog</h1>

      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="flex gap-6">
            <SideBar categoryTree={tree} />
            <div className="flex-1">
              <CatalogList categoryIds={categoryIds} />
            </div>
          </div>
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};
