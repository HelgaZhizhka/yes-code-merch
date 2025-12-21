import { CategoriesTree } from '@shared/ui/categories-tree';

import type { CategoryTree } from '@/shared/api';

interface SideBarProps {
  categoryTree: CategoryTree[];
}

export const SideBar = ({ categoryTree }: SideBarProps): React.JSX.Element => {
  return <CategoriesTree categoryTree={categoryTree} />;
};
