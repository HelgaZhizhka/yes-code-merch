import { z } from 'zod';

import { addressSchema, profileSchema } from '@shared/lib/schemas';

export const addresStepSchema = z.object({
  shippingAddresses: z.array(addressSchema),
  billingAddresses: z.array(addressSchema).optional(),
  useShippingAsBilling: z.boolean(),
});

export const viewerSchema = profileSchema.extend(addresStepSchema.shape);

export type AddressStepFormType = z.infer<typeof addresStepSchema>;
export type ViewerFormType = z.infer<typeof viewerSchema>;
