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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/ui/dialog';
import { getLinkButtonClass } from '@shared/ui/link-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@shared/ui/tooltip';

import { useDeleteProfileAddress, useSetDefaultProfileAddress } from '../hooks';

export const AddressList = ({ addresses, addressType }: AddressListProps) => {
  const { handleSetAddressDefault, isPending } = useSetDefaultProfileAddress();
  const { handleDeleteProfileAddress, isDeleting } = useDeleteProfileAddress();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xl font-bold capitalize">{addressType} address:</p>
        <Link
          to={ROUTES.PROFILE_ADD_ADDRESS}
          search={{ type: addressType }}
          className="hover:underline"
        >
          Add address +
        </Link>
      </div>
      {addresses.map((address) => (
        <Dialog key={address.id}>
          <Card className="bg-muted">
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Delete"
                          disabled={address.isDefault}
                        >
                          <Trash />
                        </Button>
                      </DialogTrigger>
                    </span>
                  </TooltipTrigger>
                  {address.isDefault && (
                    <TooltipContent>
                      <p>Add another default address to delete this one</p>
                    </TooltipContent>
                  )}
                </Tooltip>
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete this address?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={() => handleDeleteProfileAddress(address.id)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};
