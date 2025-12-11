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
      {(value / 100).toFixed(2)} {currency}
    </div>
  );
};
