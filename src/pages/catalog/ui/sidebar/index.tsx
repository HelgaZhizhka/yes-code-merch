import { CATALOG_TEXT } from '@pages/catalog/lib';

import { CategoriesTree } from '@shared/ui/categories-tree';

import type { CategoryTree } from '@/shared/api';

import { CatalogFilters } from '../catalog-filters';
import { FilterSection } from '../catalog-filters/filter-section';

interface SideBarProps {
  categoryTree: CategoryTree[];
  categoryIds: string[];
}

export const SideBar = ({
  categoryTree,
  categoryIds,
}: SideBarProps): React.JSX.Element => {
  return (
    <aside className="sticky top-5 flex w-[268px] shrink-0 flex-col">
      <FilterSection title={CATALOG_TEXT.categories.title} defaultOpen>
        <CategoriesTree categoryTree={categoryTree} variant="sidebar" />
      </FilterSection>
      {categoryIds.length > 0 && <CatalogFilters categoryIds={categoryIds} />}
    </aside>
  );
};
