import { Link } from '@tanstack/react-router';

import { ROUTES } from '@/shared/routing/types';

export const Header = (): React.JSX.Element => {
  return (
    <header className="flex justify-between items-center">
      <div className="text-xl">
        <Link to={ROUTES.HOME}>Yes Code Merch</Link>
      </div>
      {/* //TODO should be separated to component NavBar */}
      <nav>
        <Link to={ROUTES.ABOUT} className="mr-4">
          About
        </Link>
        <Link
          to={ROUTES.CATEGORY}
          params={{
            categoryId: '111',
          }}
          className="mr-4"
        >
          Category 11
        </Link>
        <Link
          to={ROUTES.SUBCATEGORY}
          params={{
            categoryId: '111',
            subCategoryId: '222',
          }}
          className="mr-4"
        >
          SubCategory 22
        </Link>
        <Link to={ROUTES.PROFILE} className="mr-4">
          Profile
        </Link>
        <Link to={ROUTES.LOGIN} className="mr-4">
          Login
        </Link>
        <Link to={ROUTES.REGISTRATION} className="mr-4">
          Registration
        </Link>
        <Link to={ROUTES.CART} className="mr-4">
          Cart
        </Link>
      </nav>
    </header>
  );
};
