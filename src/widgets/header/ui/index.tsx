import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';

const Header = (): React.JSX.Element => {
  return (
    <header className="flex justify-between items-center">
      <div className="text-xl">
        <Link to={ROUTES.HOME}>Yes Code Merch</Link>
      </div>
      {/* //TODO should be separated to component NavBar */}
    </header>
  );
};

export default Header;
