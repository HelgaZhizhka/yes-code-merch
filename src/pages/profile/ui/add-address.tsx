import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import { ROUTES } from '@shared/config/routes';
import { getLinkButtonClass } from '@shared/ui/link-button';

import { AddAddressForm } from './add-address-form';

export const AddAddress = (): React.JSX.Element => {
  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <Link to={ROUTES.PROFILE} className={getLinkButtonClass('ghost', 'icon')}>
        <ArrowLeft className="w-4 h-4" />
      </Link>
      <h2 className="mb-6 text-center">Add Address</h2>
      <AddAddressForm />
    </div>
  );
};
