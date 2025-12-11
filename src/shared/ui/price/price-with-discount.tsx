import { Price } from './price';

interface PriceWithDiscountProps {
  value: number;
  currency?: string;
}

export const PriceWithDiscount = ({
  value,
  currency = 'EUR',
}: PriceWithDiscountProps) => {
  return (
    <div>
      <Price value={value} currency={currency} />
    </div>
  );
};
