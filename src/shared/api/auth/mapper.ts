import type { Viewer } from './interfaces';

export const mapDataToRpcArgs = (viewer: Viewer) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    company,
    shippingAddress,
    useShippingAsBilling,
    billingAddress,
  } = viewer;
  return {
    _first_name: firstName,
    _last_name: lastName,
    _date_of_birth: dateOfBirth ?? undefined,
    _company: company ?? undefined,

    _ship_country: shippingAddress.country,
    _ship_city: shippingAddress.city,
    _ship_street: shippingAddress.street,
    _ship_postal: shippingAddress.postal_code,

    _use_ship_as_bill: useShippingAsBilling,

    _bill_country: useShippingAsBilling ? undefined : billingAddress?.country,
    _bill_city: useShippingAsBilling ? undefined : billingAddress?.city,
    _bill_street: useShippingAsBilling ? undefined : billingAddress?.street,
    _bill_postal: useShippingAsBilling
      ? undefined
      : billingAddress?.postal_code,
  };
};
