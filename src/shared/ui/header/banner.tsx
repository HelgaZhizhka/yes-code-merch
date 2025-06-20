import { Link } from '@tanstack/react-router';

import icon from '@shared/assets/subtract.svg';

import { ROUTES } from '@/shared/routing/types';

type BannerProps = { category: string };

const BannerText = ({ category }: BannerProps): React.JSX.Element => {
  let Text: React.JSX.Element = <>Discounts are coming!</>;

  switch (category) {
    case 'DrinkWare': {
      Text = (
        <>
          Free shipping on all{' '}
          <Link
            to={ROUTES.CATEGORY}
            params={{ categoryId: category.toLowerCase() }}
            className="underline"
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
            to={ROUTES.SUBCATEGORY}
            params={{
              categoryId: 'clothes',
              subCategoryId: category.toLowerCase(),
            }}
            className="underline"
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

export const Banner = ({ category }: BannerProps): React.JSX.Element => {
  return (
    <div className="flex gap-2 grow-1 items-center">
      <img src={icon} width={28} height={28} alt="discount icon" />
      <BannerText category={category} />
    </div>
  );
};
