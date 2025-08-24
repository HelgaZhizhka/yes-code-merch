import { Link } from '@tanstack/react-router';
import { Pencil, Trash } from 'lucide-react';

import type { AddressListProps } from '@pages/profile/interfaces';

import { ROUTES } from '@shared/config/routes';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/ui/card';
import { getLinkButtonClass } from '@shared/ui/link-button';

import { useSetDefaultProfileAddress } from '../hooks';

export const AddressList = ({ addresses, addressType }: AddressListProps) => {
  const { handleSetAddressDefault, isPending } = useSetDefaultProfileAddress();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xl font-bold capitalize">{addressType} address:</p>
        <Link to={ROUTES.PROFILE_ADD_ADDRESS} className="hover:underline">
          Add address +
        </Link>
      </div>
      {addresses.map((address) => (
        <Card key={address.id} className="bg-muted">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>
              {address.isDefault ? (
                <Badge variant="ghost" className="transition-all">
                  Default
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() =>
                    handleSetAddressDefault(address.id, addressType)
                  }
                >
                  Set as default
                </Button>
              )}
            </CardTitle>
            <CardAction className="flex items-center gap-2">
              <Link
                to={ROUTES.PROFILE_EDIT_ADDRESS}
                params={{ addressId: address.id }}
                className={getLinkButtonClass('ghost', 'icon')}
              >
                <Pencil />
              </Link>
              <Button size="icon" variant="ghost" aria-label="Delete">
                <Trash />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              {address.streetName} {address.streetNumber}
              <br />
              {address.city} {address.country}, {address.postalCode}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
