import { CategoriesTree } from '@shared/ui/categories-tree';

import type { CategoryTree } from '@/shared/api';

import { CatalogFilters } from '../catalog-filters';

interface SideBarProps {
  categoryTree: CategoryTree[];
  categoryIds: string[];
}

export const SideBar = ({
  categoryTree,
  categoryIds,
}: SideBarProps): React.JSX.Element => {
  return (
    <aside className="sticky top-5 flex w-[268px] shrink-0 flex-col gap-4">
      <CategoriesTree categoryTree={categoryTree} variant="sidebar" />
      {categoryIds.length > 0 && <CatalogFilters categoryIds={categoryIds} />}
    </aside>
  );
};
