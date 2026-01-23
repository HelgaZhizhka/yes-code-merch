import { localeConfig } from '@shared/config/locale';

export const formatPrice = (priceInCents: number, currency: string): string => {
  const value = priceInCents / 100;
  console.log(localeConfig.locale);

  return new Intl.NumberFormat(localeConfig.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDiscountPercentage = (percentage: number): string => {
  return `-${Math.round(percentage)}%`;
};
