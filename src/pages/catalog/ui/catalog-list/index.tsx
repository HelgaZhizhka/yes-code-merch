import { ProductList, useProducts } from '@entities/product';

interface CatalogListProps {
  categoryIds: string[] | null;
}

export const CatalogList = ({
  categoryIds,
}: CatalogListProps): React.JSX.Element | null => {
  const { data: products } = useProducts({
    categoryIds: categoryIds ?? [],
  });

  if (!categoryIds || categoryIds.length === 0) {
    return null;
  }

  return <ProductList products={products} />;
};
