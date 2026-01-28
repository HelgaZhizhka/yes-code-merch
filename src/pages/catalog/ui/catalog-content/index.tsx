import { ProductList, useCatalogSearch, useProducts } from '@entities/product';

import { CatalogHeader } from '../catalog-header';

interface CatalogContentProps {
  categoryIds: string[] | null;
}

export const CatalogContent = ({
  categoryIds,
}: CatalogContentProps): React.JSX.Element | null => {
  const { searchParams } = useCatalogSearch();

  const {
    data: { data: products },
  } = useProducts({
    categoryIds: categoryIds ?? [],
    ...searchParams,
  });

  if (!categoryIds || categoryIds.length === 0) {
    return null;
  }

  return (
    <div className="flex-1">
      <CatalogHeader />
      <ProductList products={products} />
    </div>
  );
};
