import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';

const Header = (): React.JSX.Element => {
  return (
    <header className="bg-gray-100 p-4 flex justify-between items-center">
      <div className="font-bold text-xl">
        <Link to={ROUTES.HOME} className="mr-4">
          Yes Code Merch
        </Link>
      </div>
      {/* //TODO should be separated to component NavBar */}
      <nav>
        <Link to={ROUTES.ABOUT} className="mr-4">
          About
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

export default Header;
