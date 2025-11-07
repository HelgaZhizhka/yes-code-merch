import { z } from 'zod';

import { addressSchema } from '@shared/lib/schemas';

export const addressStepSchema = z.object({
  shippingAddresses: z.array(addressSchema),
  billingAddresses: z.array(addressSchema).optional(),
  useShippingAsBilling: z.boolean(),
});

export type AddressStepFormType = z.infer<typeof addressStepSchema>;
