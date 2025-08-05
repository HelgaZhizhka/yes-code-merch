import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';

export const ProfileOverview = (): React.JSX.Element => {
  return (
    <div>
      <h2 className="mb-6 text-center">Profile Overview</h2>
      <nav className="flex flex-col gap-2">
        <Link to={ROUTES.PROFILE_PERSONAL}>Edit Personal</Link>
        <Link to={ROUTES.PROFILE_SECRET}>Change Password</Link>
        <Link to={ROUTES.PROFILE_NEW_ADDRESS}>Add Address</Link>
        <Link to={ROUTES.PROFILE_OLD_ADDRESS} params={{ addressId: '123' }}>
          Edit Address
        </Link>
      </nav>
    </div>
  );
};
