import { ProductCard } from './product-card';

import type { CatalogProduct } from '../api/types';

interface ProductListProps {
  products: CatalogProduct[];
}

export const ProductList = ({ products }: ProductListProps) => {
  if (products.length === 0) {
    return <p>No products found</p>;
  }

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </>
  );
};
