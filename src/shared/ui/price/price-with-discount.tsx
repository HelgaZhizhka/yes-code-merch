import { Price } from './price';

interface PriceWithDiscountProps {
  originalPrice: number;
  finalPrice: number;
  currency?: string;
}

export const PriceWithDiscount = ({
  originalPrice,
  finalPrice,
  currency = 'EUR',
}: PriceWithDiscountProps): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-1">
      <Price value={originalPrice} currency={currency} variant="old" />
      <Price value={finalPrice} currency={currency} />
    </div>
  );
};
