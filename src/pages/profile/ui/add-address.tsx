import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';

export const AddAddress = (): React.JSX.Element => {
  return (
    <div>
      <h2 className="mb-6 text-center">Add Address</h2>
      <Link to={ROUTES.PROFILE}>Back to Profile</Link>
    </div>
  );
};
