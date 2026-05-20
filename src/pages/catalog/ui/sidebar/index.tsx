import { CATALOG_TEXT } from '@entities/catalog';

import { CategoriesTree } from '@shared/ui/categories-tree';
import { FilterSection } from '@shared/ui/filter-section';

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
    <aside className="sticky top-5 hidden lg:flex w-[268px] shrink-0 flex-col">
      <FilterSection title={CATALOG_TEXT.categories.title} defaultOpen>
        <CategoriesTree categoryTree={categoryTree} variant="sidebar" />
      </FilterSection>
      {categoryIds.length > 0 && <CatalogFilters categoryIds={categoryIds} />}
    </aside>
  );
};
