import { Link } from '@tanstack/react-router';
import { cva } from 'class-variance-authority';

import icon from '@shared/assets/subtract.svg';
import { ROUTES } from '@shared/config/routes';

type BannerProps = { category: string; variant?: 'default' | 'mobile' };

const bannerVariants = cva('transition-all', {
  variants: {
    variant: {
      default: 'flex gap-2 grow-1 items-center',
      mobile:
        'flex flex-col w-[300px] items-center text-center mx-auto border-t-2 border-primary pt-8 gap-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const BannerText = ({ category }: BannerProps): React.JSX.Element => {
  let Text: React.JSX.Element = <>Discounts are coming!</>;

  switch (category) {
    case 'DrinkWare': {
      Text = (
        <>
          Free shipping on all{' '}
          <Link
            to={ROUTES.CATEGORY}
            params={{ _splat: category.toLowerCase() }}
            className="hover:underline"
          >
            {category}
          </Link>{' '}
          this month!
        </>
      );
      break;
    }
    case 'T-Shirts': {
      Text = (
        <>
          Discount on all{' '}
          <Link
            to={ROUTES.CATEGORY}
            params={{
              _splat: category.toLowerCase(),
            }}
            className="hover:underline"
          >
            {category}
          </Link>{' '}
          this month!
        </>
      );
      break;
    }
    default: {
      break;
    }
  }

  return <p className="text-xl">{Text}</p>;
};

export const Banner = ({
  category,
  variant,
}: BannerProps): React.JSX.Element => {
  return (
    <div className={bannerVariants({ variant })}>
      <img src={icon} width={28} height={28} alt="discount icon" />
      <BannerText category={category} />
    </div>
  );
};
