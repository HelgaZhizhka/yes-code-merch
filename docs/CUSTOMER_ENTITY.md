# Customer Entity

Customer entity for working with user profile data.

## Structure

```text
entities/customer/
  ├── api/
  │   ├── types.ts       # TypeScript types (DTO, domain models)
  │   ├── mapper.ts      # DTO -> Domain mapping
  │   ├── index.ts       # Supabase API functions (getCustomer, updateCustomer)
  │   └── hooks.ts       # React Query hooks
  ├── lib/               # Validation, helpers
  ├── ui/                # UI components (forms, inputs)
  └── index.ts           # Public API re-exports
```

## Features

- ✅ **Single customer row per user** — enforced by `user_id` uniqueness and `upsert`.
- ✅ **Typed DTOs from Supabase** — using generated `Public['Tables']['customers']['Row']`.
- ✅ **Domain mapping** — `CustomerRowDTO -> CustomerDataWithId` via mapper.
- ✅ **React Query integration** — `useSuspenseQuery` + `useMutation` with cache invalidation.
- ✅ **Integration with onboarding and profile flows**.

## API

### Types

```typescript
// DTO from Supabase
export type CustomerRowDTO = Public['Tables']['customers']['Row'];
export type CustomerInsertDTO = Public['Tables']['customers']['Insert'];

// Domain model used in forms and UI
export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  title?: string | null;
  company?: string | null;
}

export interface CustomerDataWithId extends CustomerData {
  id: string; // user_id
}
```

### Mapping

```typescript
// mapper.ts
export const mapCustomerFromDB = (row: CustomerRowDTO): CustomerDataWithId => ({
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  phone: row.phone,
  dateOfBirth: row.date_of_birth,
  title: row.title || null,
  company: row.company || null,
  id: row.user_id,
});

export const mapCustomerToDB = (
  customer: CustomerDataWithId
): CustomerInsertDTO => ({
  first_name: customer.firstName,
  last_name: customer.lastName,
  email: customer.email,
  phone: customer.phone,
  date_of_birth: customer.dateOfBirth,
  title: customer.title ?? null,
  company: customer.company ?? null,
  user_id: customer.id,
});
```

### Supabase API

```typescript
// index.ts
export const getCustomer = async (): Promise<CustomerRowDTO | null> => {
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .maybeSingle()
    .throwOnError();

  return customer ?? null;
};

export const updateCustomer = async (
  data: CustomerData
): Promise<CustomerData | null> => {
  const user = await getCurrentUser();
  const dbData = mapCustomerToDB({ ...data, id: user.id });

  const { data: customer } = await supabase
    .from('customers')
    .upsert(dbData, {
      onConflict: 'user_id',
    })
    .select('*')
    .single()
    .throwOnError();

  return mapCustomerFromDB(customer);
};
```

### React Query Hooks

```typescript
// hooks.ts
export const queryKey = {
  customerData: ['customerData'],
} as const;

export const useGetCustomer = (): {
  data: CustomerDataWithId | null;
} => {
  const { data } = useSuspenseQuery<
    CustomerRowDTO | null,
    Error,
    CustomerDataWithId | null
  >({
    queryKey: queryKey.customerData,
    queryFn: getCustomer,
    select: (customer) => (customer ? mapCustomerFromDB(customer) : null),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { data };
};

export const useUpdateCustomer = (): UseMutationResult<
  CustomerData | null,
  Error,
  CustomerData
> => {
  const queryClient = useQueryClient();

  return useMutation<CustomerData | null, Error, CustomerData>({
    mutationFn: (data: CustomerData) => updateCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.customerData });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Updating customer failed:', error.message);
      }
    },
  });
};
```

## Flow: Customer Data

### Onboarding

- `useFormStore` accumulates profile data across onboarding steps.
- `getCustomerData(email)` (in onboarding model) builds `CustomerData` from form state.
- `useUpdateCustomer` is used in the final onboarding step to create/update the customer row.

### Profile

- `useGetCustomer` loads existing data to prefill profile forms.
- `useUpdateCustomer` updates customer profile and invalidates `customerData` query so all consumers see fresh data.
