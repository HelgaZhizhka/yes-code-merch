import { ProductList, useCatalogSearch, useProducts } from '@entities/product';

import { CatalogHeader } from '../catalog-header';
import { CatalogPagination } from '../catalog-pagination';

interface CatalogContentProps {
  categoryIds: string[] | null;
}

export const CatalogContent = ({
  categoryIds,
}: CatalogContentProps): React.JSX.Element | null => {
  const { searchParams } = useCatalogSearch();

  const {
    data: { data: products, meta },
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
      <CatalogPagination meta={meta} />
    </div>
  );
};
