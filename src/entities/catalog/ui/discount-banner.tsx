import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import { Banner } from '@shared/ui/banner';

import { useTopDiscountedCategory } from '../api/hooks';

interface DiscountBannerProps {
  variant?: 'default' | 'mobile';
}

export const DiscountBanner = ({
  variant,
}: DiscountBannerProps): React.JSX.Element | null => {
  const result = useTopDiscountedCategory();
  if (!result) return null;

  return (
    <Banner variant={variant}>
      Discounts on{' '}
      <Link
        to={ROUTES.CATEGORY}
        params={{ _splat: result.root.slug }}
        className="hover:underline"
      >
        {result.root.name}
      </Link>{' '}
      this month!
    </Banner>
  );
};
