import { useParams } from '@tanstack/react-router';
import { Suspense } from 'react';

import { CategoriesTree } from '@/shared/ui/categories-tree';

export const Catalog = (): React.JSX.Element => {
  const { _splat } = useParams({ strict: false });
  const currentSlug = _splat.split('/').at(-1);
  return (
    <div>
      <h1 className="text-2xl">Catalog Page</h1>
      <p>This is the Catalog page component.</p>
      <p>{_splat}</p>
      <p>{currentSlug}</p>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesTree />
      </Suspense>
    </div>
  );
};
