import { cva } from 'class-variance-authority';

interface PriceProps {
  value: number;
  variant?: 'catalog' | 'product';
  currency?: string;
}

const priceVariants = cva('transition-all', {
  variants: {
    variant: {
      catalog: 'text-2xl font-semibold text-secondary',
      product: 'text-xl font-bold',
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
      {(value / 100).toFixed(2)} {currency}
    </div>
  );
};
