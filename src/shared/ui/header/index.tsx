import { ROUTES } from '@shared/model/constants';
import { Link } from '@tanstack/react-router';

export const Header = (): React.JSX.Element => {
  return (
    <header className="flex justify-between items-center">
      <div className="text-xl">
        <Link to={ROUTES.HOME}>Yes Code Merch</Link>
      </div>
      {/* //TODO should be separated to component NavBar */}
      <nav className="flex gap-4">
        <Link to={ROUTES.ABOUT}>About</Link>
        <Link
          to={ROUTES.CATEGORY}
          params={{
            categoryId: '111',
          }}
        >
          Category 11
        </Link>
        <Link
          to={ROUTES.SUBCATEGORY}
          params={{
            categoryId: '111',
            subCategoryId: '222',
          }}
        >
          SubCategory 22
        </Link>
        <Link to={ROUTES.PROFILE}>Profile</Link>
        <Link to={ROUTES.LOGIN}>Login</Link>
        <Link to={ROUTES.REGISTRATION}>Registration</Link>
        <Link to={ROUTES.CART}>Cart</Link>
      </nav>
    </header>
  );
};
