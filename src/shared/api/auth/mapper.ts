import type { Database } from '@shared/api/database.types';

import type { Viewer } from './interfaces';

export type RpcArgs =
  Database['public']['Functions']['complete_registration']['Args'];

export const mapViewerDataToRpcArgs = (viewer: Viewer): RpcArgs => {
  const {
    title,
    firstName,
    lastName,
    dateOfBirth,
    phone,
    email,
    company,
    shippingAddresses,
    billingAddresses,
    useShippingAsBilling,
  } = viewer;

  const shipping = shippingAddresses[0];
  const billing = billingAddresses?.[0];

  return {
    _first_name: firstName,
    _last_name: lastName,
    _phone: phone,
    _email: email,
    _title: title ?? '',
    _date_of_birth: dateOfBirth ?? '',
    _company: company ?? '',

    _ship_country: shipping?.country ?? '',
    _ship_city: shipping?.city ?? '',
    _ship_street_name: shipping?.streetName ?? '',
    _ship_street_number: shipping?.streetNumber ?? '',
    _ship_postal: shipping?.postalCode ?? '',
    _ship_is_default: shipping?.isDefault ?? false,

    _use_ship_as_bill: useShippingAsBilling,

    _bill_country: useShippingAsBilling ? '' : (billing?.country ?? ''),
    _bill_city: useShippingAsBilling ? '' : (billing?.city ?? ''),
    _bill_street_name: useShippingAsBilling ? '' : (billing?.streetName ?? ''),
    _bill_street_number: useShippingAsBilling
      ? ''
      : (billing?.streetNumber ?? ''),
    _bill_postal: useShippingAsBilling ? '' : (billing?.postalCode ?? ''),
    _bill_is_default: useShippingAsBilling
      ? false
      : (billing?.isDefault ?? false),
  };
};
