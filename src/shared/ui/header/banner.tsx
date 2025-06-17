import { ROUTES } from '@/shared/routing/types';
import icon from '@shared/assets/subtract.svg';
import { Link } from '@tanstack/react-router';

export const Banner = (): React.JSX.Element => {
  const category = 'DrinkWire';

  return (
    <div className="flex gap-2 grow-1 items-center">
      <img src={icon} width={28} height={28} />
      <p className="text-xl">
        Free shipping on all{' '}
        <Link
          to={ROUTES.CATEGORY}
          params={{ categoryId: category.toLowerCase() }}
          className="underline"
        >
          {category}
        </Link>{' '}
        this month!
      </p>
    </div>
  );
};
