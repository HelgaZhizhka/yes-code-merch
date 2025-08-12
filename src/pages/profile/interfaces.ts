import type { AddressType } from '@pages/profile/types';

import type { AddressWithID } from '@shared/interfaces';

export interface AddressListProps {
  addresses: AddressWithID[];
  type: AddressType;
}
