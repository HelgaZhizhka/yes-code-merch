import { Button } from '@shared/ui/button';
import { Checkbox } from '@shared/ui/checkbox';
import { CountrySelect } from '@shared/ui/country-select';
import { Form } from '@shared/ui/form';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';
import { Input } from '@shared/ui/input';

import { useFormStep } from '../hooks';

export const AddressStep = (): React.JSX.Element => {
  const { form, handleSubmit, handleBack, isPending } = useFormStep();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <h3 className="text-lg">Shipping address:</h3>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
          <FormFieldWrapper
            control={form.control}
            name="country"
            label="Country"
          >
            {(field) => (
              <CountrySelect value={field.value} onChange={field.onChange} />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="city" label="City">
            {(field) => <Input type="text" placeholder="City" {...field} />}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={form.control}
            name="streetName"
            label="Street Name"
          >
            {(field) => (
              <Input type="text" placeholder="Street Name" {...field} />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={form.control}
            name="streetNumber"
            label="Street Number"
          >
            {(field) => (
              <Input type="text" placeholder="Street Number" {...field} />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={form.control}
            name="postalCode"
            label="Postal Code"
          >
            {(field) => (
              <Input type="text" placeholder="Postal Code" {...field} />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={form.control}
            name="isDefault"
            label="Set as default"
          >
            {(field) => (
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
            )}
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper
          control={form.control}
          name="useShippingAsBilling"
          label="Use for billing"
        >
          {(field) => (
            <Checkbox
              checked={field.value ?? true}
              onCheckedChange={(checked) => field.onChange(checked)}
            />
          )}
        </FormFieldWrapper>

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
