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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
};
