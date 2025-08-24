import { AddressForm } from '@shared/ui/address-form';
import { Button } from '@shared/ui/button';
import { Checkbox } from '@shared/ui/checkbox';
import { Form } from '@shared/ui/form';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';

import { useFormStep } from '../hooks';

export const AddressStep = (): React.JSX.Element => {
  const {
    form,
    handleSubmit,
    handleBack,
    isPending,
    useShippingAsBilling,
    handleUseShippingAsBillingChange,
  } = useFormStep();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <AddressForm prefix="shippingAddresses.0" label="Shipping address" />

        <FormFieldWrapper
          control={form.control}
          name="useShippingAsBilling"
          label="Use shipping address as billing"
          labelPosition="right"
        >
          {(field) => (
            <Checkbox
              checked={useShippingAsBilling}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                handleUseShippingAsBillingChange(!!checked);
              }}
            />
          )}
        </FormFieldWrapper>

        {!useShippingAsBilling && (
          <AddressForm prefix="billingAddresses.0" label="Billing address" />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid || isPending}
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleBack}
        >
          Back
        </Button>
      </form>
    </Form>
  );
};
