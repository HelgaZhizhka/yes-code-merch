import { z } from 'zod';

import { addressSchema } from '@entities/address';

export const addressStepSchema = z.object({
  shippingAddresses: z.array(addressSchema),
  billingAddresses: z.array(addressSchema).optional(),
  useShippingAsBilling: z.boolean(),
});

export type AddressStepFormType = z.infer<typeof addressStepSchema>;
