import type { ReactNode } from 'react';

import { Price, PriceWithDiscount } from '@shared/ui/price';
import { PurifiedHtml } from '@shared/ui/purified-html';

import type { CatalogProduct } from '../model/types';

interface CatalogCardProps {
  product: CatalogProduct;
  actions?: ReactNode;
}

export const CatalogCard = ({
  product,
  actions,
}: CatalogCardProps): React.JSX.Element => {
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
        {actions}
      </div>
      <h3 className="text-2xl font-bold">{product.name}</h3>
      {product.description && (
        <div className="line-clamp-2 text-sm text-muted-foreground">
          <PurifiedHtml html={product.description} />
        </div>
      )}
      <div className="mt-auto">
        {product.hasDiscount ? (
          <PriceWithDiscount
            originalPrice={product.originalPrice}
            finalPrice={product.finalPrice}
            currency={product.currency}
          />
        ) : (
          <Price value={product.originalPrice} currency={product.currency} />
        )}
      </div>
    </div>
  );
};
