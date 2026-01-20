import { cva } from 'class-variance-authority';

import { formatPrice } from '@shared/lib/price-formatter';

interface PriceProps {
  value: number;
  variant?: 'catalog' | 'product' | 'old';
  currency?: string;
}

const priceVariants = cva('transition-all', {
  variants: {
    variant: {
      catalog: 'text-2xl font-semibold text-secondary',
      product: 'text-xl font-bold',
      old: 'text-sm text-gray-400 line-through',
    },
  },
  defaultVariants: { variant: 'catalog' },
});

export const Price = ({
  value,
  variant,
  currency = 'EUR',
}: PriceProps): React.JSX.Element => {
  return (
    <div className={priceVariants({ variant })}>
      {formatPrice(value, currency)}
    </div>
  );
};
