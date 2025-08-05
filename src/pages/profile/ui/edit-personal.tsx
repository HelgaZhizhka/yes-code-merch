import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';

export const EditPersonal = (): React.JSX.Element => {
  return (
    <div>
      <h2 className="mb-6 text-center">Edit Personal</h2>
      <Link to={ROUTES.PROFILE}>Back to Profile</Link>
    </div>
  );
};
