export const formatPrice = (priceInCents: number, currency: string): string => {
  const value = priceInCents / 100;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDiscountPercentage = (percentage: number): string => {
  return `-${Math.round(percentage)}%`;
};
