import { CartButton } from '@features/cart-button';
import { Price } from '@features/price';

import type { CatalogProduct } from '../api/types';

interface ProductCardProps {
  product: CatalogProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const imageUrl =
    product.images?.medium || 'https://placehold.co/400x400?text=No+Image';

  return (
    <div className="flex flex-col gap-4 max-w-xs w-full p-2">
      <div className="w-full relative aspect-[3/4] overflow-hidden shadow-md">
        <img
          src={imageUrl}
          alt={product.name}
          width={380}
          height={460}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <CartButton variant="catalog" />
      </div>
      <h3 className="text-2xl font-bold">{product.name}</h3>
      {product.description && <p className="text-sm">{product.description}</p>}
      <div className="mt-auto">
        <Price value={product.finalPrice} variant="catalog" />
      </div>
    </div>
  );
};
