import { useCategoriesTree } from '@shared/api';
import { CategoriesTree } from '@shared/ui/categories-tree';

export const FooterCategories = (): React.JSX.Element => {
  const { data: categoryTree } = useCategoriesTree();
  return <CategoriesTree categoryTree={categoryTree} variant="footer" />;
};
