import { AddressForm } from '@shared/ui/address-form';
import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';

import { useAddAddressForm } from '../hooks';

export const AddAddressForm = (): React.JSX.Element => {
  const { form, onSubmit, isPending } = useAddAddressForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AddressForm prefix="" showDefaultCheckbox={false} />

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid || isPending}
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
};
