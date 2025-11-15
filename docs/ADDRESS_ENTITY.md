# Address Entity

Address entity for managing user shipping and billing addresses.

## Structure

```text
entities/address/
  ├── api/
  │   ├── types.ts       # DTO + domain models
  │   ├── mapper.ts      # DTO <-> Domain mapping
  │   ├── index.ts       # Supabase API (CRUD + default address)
  │   └── hooks.ts       # React Query hooks
  ├── lib/
  │   └── schema.ts      # Zod schema + defaultAddress
  ├── ui/
  │   └── address-form.tsx
  └── index.ts           # Public API
```

## Usage

### React Query Hooks

```typescript
import {
  useGetAddressess,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from 'entities/address';

function ProfileAddresses() {
  const { data: addresses } = useGetAddressess();

  return (
    <div>
      <AddressList
        shippingAddresses={addresses.shippingAddresses}
        billingAddresses={addresses.billingAddresses}
      />
    </div>
  );
}
```

### Direct API Call

```typescript
import { getAddresses, createAddress } from 'entities/address/api';

async function bootstrapAddresses(address: Address) {
  const rows = await getAddresses();

  if (rows.length === 0) {
    await createAddress({ address, addressType: 'shipping' });
  }
}
```

## Features

- ✅ **Separate shipping and billing addresses** via `AddressType`.
- ✅ **Default address management** per type (shipping / billing).
- ✅ **Typed DTOs for `addresses` table**.
- ✅ **Domain-level grouping**: `{ shippingAddresses, billingAddresses }`.
- ✅ **Validation with Zod** via `addressSchema`.
- ✅ **Integrated into onboarding and profile flows**.

## API

### Types

```typescript
// DTO from Supabase
export type AddressRowDTO = Public['Tables']['addresses']['Row'];
export type AddressInsertDTO = Public['Tables']['addresses']['Insert'];

export interface Address {
  country: string;
  city: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface AddressWithId extends Address {
  id: string;
}

export interface Addresses {
  shippingAddresses: AddressWithId[];
  billingAddresses?: AddressWithId[];
}

export type AddressType = 'shipping' | 'billing';
```

### Validation Schema

```typescript
// lib/schema.ts
export const addressSchema = z
  .object({
    country: z.string().trim().min(1, ErrorMessages.countryRequired),
    city: z
      .string()
      .trim()
      .min(1, ErrorMessages.cityRequired)
      .regex(VALIDATION_REGEX.namePattern, ErrorMessages.cityInvalid),
    streetName: z
      .string()
      .trim()
      .min(1, ErrorMessages.streetNameRequired)
      .regex(
        VALIDATION_REGEX.streetNamePattern,
        ErrorMessages.streetNameInvalid
      ),
    streetNumber: z
      .string()
      .trim()
      .min(1, ErrorMessages.streetNumberRequired)
      .regex(
        VALIDATION_REGEX.streetNumberPattern,
        ErrorMessages.streetNumberInvalid
      ),
    postalCode: z.string().trim().min(1, ErrorMessages.postalCodeRequired),
    isDefault: z.boolean().optional(),
  })
  .check((ctx) => {
    const { country, postalCode } = ctx.value;

    if (!country || !postalCode) return;

    const result = PostalCodes.validate(country, postalCode);

    if (result !== true) {
      ctx.issues.push({
        code: 'invalid_format',
        message: `${result}`,
        path: ['postalCode'],
        input: postalCode,
        format: 'postalCode',
      });
    }
  });

export const defaultAddress: Address = {
  country: '',
  city: '',
  streetName: '',
  streetNumber: '',
  postalCode: '',
  isDefault: false,
};
```

### Mapping

```typescript
// mapper.ts
export const mapAddressToDB = (
  address: Address,
  addressType: AddressType
): AddressInsertDTO => ({
  country: address.country,
  city: address.city,
  street_name: address.streetName,
  street_number: address.streetNumber,
  postal_code: address.postalCode,
  is_default_shipping: addressType === 'shipping' ? address.isDefault : false,
  is_default_billing: addressType === 'billing' ? address.isDefault : false,
  is_billing_address: addressType === 'billing',
  is_shipping_address: addressType === 'shipping',
});

export const mapAddressFromDB = (address: AddressRowDTO[]): AddressWithId[] =>
  address.map((row) => ({
    id: row.id,
    country: row.country,
    city: row.city,
    streetName: row.street_name ?? '',
    streetNumber: row.street_number ?? '',
    postalCode: row.postal_code,
    isDefault: row.is_default_shipping || row.is_default_billing,
  }));

export const mapAddressesFromDB = (
  rows: readonly AddressRowDTO[]
): Addresses => {
  const shippingAddresses = mapAddressFromDB(
    rows.filter((row) => row.is_shipping_address)
  );

  const billingAddresses = mapAddressFromDB(
    rows.filter((row) => row.is_billing_address)
  );

  return { shippingAddresses, billingAddresses };
};
```

### Supabase API

```typescript
// index.ts
export const getAddresses = async (): Promise<AddressRowDTO[]> => {
  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .throwOnError();

  return addresses ?? [];
};

export const createAddress = async ({
  address,
  addressType,
}: {
  address: Address;
  addressType: AddressType;
}): Promise<AddressWithId | null> => {
  const dbData = mapAddressToDB(address, addressType);

  const { data: row } = await supabase
    .from('addresses')
    .insert(dbData)
    .select('*')
    .single()
    .throwOnError();

  return mapAddressFromDB([row])[0];
};

export const updateAddress = async (
  address: AddressWithId,
  addressType: AddressType
): Promise<AddressWithId | null> => {
  const dbData = mapAddressToDB(address, addressType);

  const { data: row } = await supabase
    .from('addresses')
    .update(dbData)
    .eq('id', address.id)
    .select('*')
    .single()
    .throwOnError();

  return mapAddressFromDB([row])[0];
};

export const deleteAddress = async (addressId: string): Promise<boolean> => {
  await supabase.from('addresses').delete().eq('id', addressId).throwOnError();

  return true;
};

export const setDefaultAddress = async ({
  addressId,
  addressType,
}: {
  addressId: string;
  addressType: AddressType;
}): Promise<void> => {
  const user = await getCurrentUser();

  const { data: address, error: fetchError } = await supabase
    .from('addresses')
    .select('id')
    .eq('id', addressId)
    .eq('user_id', user.id)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  if (!address) {
    throw new Error('Address not found or does not belong to current user');
  }

  const defaultField =
    addressType === 'shipping' ? 'is_default_shipping' : 'is_default_billing';

  await supabase
    .from('addresses')
    .update({ [defaultField]: false })
    .eq('user_id', user.id)
    .eq(defaultField, true)
    .throwOnError();

  await supabase
    .from('addresses')
    .update({ [defaultField]: true })
    .eq('id', addressId)
    .eq('user_id', user.id)
    .throwOnError();
};
```

### React Query Hooks

```typescript
// hooks.ts
export const queryKey = {
  addresses: ['addresses'],
} as const;

export const useGetAddressess = (): {
  data: Addresses;
} => {
  const { data } = useSuspenseQuery<AddressRowDTO[], Error, Addresses>({
    queryKey: queryKey.addresses,
    queryFn: getAddresses,
    select: mapAddressesFromDB,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { data };
};

export const useCreateAddress = (): UseMutationResult<
  AddressWithId | null,
  Error,
  { address: Address; addressType: AddressType }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    AddressWithId | null,
    Error,
    { address: Address; addressType: AddressType }
  >({
    mutationFn: ({ address, addressType }) =>
      createAddress({ address, addressType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.addresses });
    },
  });
};

// Similar hooks exist for useUpdateAddress, useDeleteAddress, useSetDefaultAddress
```

## Flow: Addresses

### Onboarding

- `useFormStore` (onboarding model) builds shipping and optional billing address payloads.
- `useCreateAddress` is used in the final onboarding step to persist shipping and billing addresses.
- When "Use shipping address as billing" is enabled, billing payload is derived from the shipping address but saved with `addressType: 'billing'`.

### Profile

- `useGetAddressess` loads grouped addresses for the profile page.
- `useCreateAddress` / `useUpdateAddress` add or edit addresses.
- `useDeleteAddress` removes an address.
- `useSetDefaultAddress` updates default shipping/billing address flags for the current user.

## Cache and Invalidation

Addresses are cached indefinitely (`staleTime: Infinity`) since they are user-specific data that only change through the app itself (via mutations).

Cache invalidation occurs in all mutation hooks (`useCreateAddress`, `useUpdateAddress`, `useDeleteAddress`, `useSetDefaultAddress`) to ensure the UI reflects the latest state after successful operations.

This approach avoids unnecessary refetches while keeping the data fresh after user actions.
