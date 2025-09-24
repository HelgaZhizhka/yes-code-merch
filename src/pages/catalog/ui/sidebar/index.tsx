import { Suspense } from 'react';

import { CategoriesTree } from '@/shared/ui/categories-tree';

export const SideBar = (): React.JSX.Element => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesTree />
    </Suspense>
  );
};
