import type { AddressType } from '@shared/api';
import type { AddressWithID } from '@shared/interfaces';

export interface AddressListProps {
  addresses: AddressWithID[];
  addressType: AddressType;
}
