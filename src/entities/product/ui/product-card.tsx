import type { CatalogProduct } from '../api/types';

interface ProductCardProps {
  product: CatalogProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const imageUrl =
    product.images?.medium || 'https://placehold.co/400x400?text=No+Image';

  return (
    <>
      <img
        src={imageUrl}
        alt={product.name}
        width={380}
        height={460}
        loading="lazy"
        decoding="async"
      />
      <h3>{product.name}</h3>
    </>
  );
};
