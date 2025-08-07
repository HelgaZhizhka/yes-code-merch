import { Link } from '@tanstack/react-router';

import { useCustomer } from '@pages/profile/hooks';

import { ROUTES } from '@shared/config/routes';

export const Overview = (): React.JSX.Element => {
  const customer = useCustomer();

  console.log(customer);

  return (
    <div>
      <h2 className="mb-6 text-center">Overview</h2>
      <nav className="flex flex-col gap-2">
        <Link to={ROUTES.PROFILE_PERSONAL}>Edit Personal</Link>
        <Link to={ROUTES.PROFILE_SECRET}>Change Password</Link>
        <Link to={ROUTES.PROFILE_ADD_ADDRESS}>Add Address</Link>
        <Link to={ROUTES.PROFILE_EDIT_ADDRESS} params={{ addressId: '123' }}>
          Edit Address
        </Link>
      </nav>
    </div>
  );
};
