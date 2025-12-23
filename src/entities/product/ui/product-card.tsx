import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

import { AddToCart } from '@features/add-to-cart';

import { Price } from '@shared/ui/price';

import type { CatalogProduct } from '../api/types';

interface ProductCardProps {
  product: CatalogProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const imageUrl =
    product.images?.medium || 'https://placehold.co/400x400?text=No+Image';

  const sanitizedDescription = product.description
    ? DOMPurify.sanitize(product.description)
    : null;
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
        <AddToCart variant="catalog" />
      </div>
      <h3 className="text-2xl font-bold">{product.name}</h3>
      {sanitizedDescription && (
        <div className="text-sm">{parse(sanitizedDescription)}</div>
      )}
      <div className="mt-auto">
        <Price value={product.finalPrice} variant="catalog" />
      </div>
    </div>
  );
};
