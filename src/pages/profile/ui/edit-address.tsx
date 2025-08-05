import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';

export const ProfileEditAddress = (): React.JSX.Element => {
  return (
    <div>
      <h2 className="mb-6 text-center">Profile Edit Address</h2>
      <Link to={ROUTES.PROFILE}>Back to Profile</Link>
    </div>
  );
};
