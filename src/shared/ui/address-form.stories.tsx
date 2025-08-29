import type { Meta, StoryFn } from '@storybook/react-vite';
import { z } from 'zod';

import { addressSchema, type AddressFormType } from '@shared/lib/schemas';
import { defaultAddress } from '@shared/lib/validators';
import { AddressForm, type AddressFormProps } from '@shared/ui/address-form';
import { Button } from '@shared/ui/button';

import { FormValidation } from '.storybook/form-validation';

const meta: Meta<typeof AddressForm> = {
  title: 'shared/ui/form/address',
  component: AddressForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    prefix: {
      control: 'text',
      description: 'Field name prefix for form fields',
    },
    label: {
      control: 'text',
      description: 'Legend text for the fieldset',
    },
  },
};

export default meta;

const onSubmit = (formData: Record<string, AddressFormType>) => {
  const addressData = formData[Object.keys(formData)[0]];
  console.log('Address Data:', addressData);
};

const Template: StoryFn<AddressFormProps> = (args) => (
  <FormValidation
    schema={z.object({
      [args.prefix as string]: addressSchema,
    })}
    initialValues={{ [args.prefix as string]: defaultAddress }}
  >
    {(methods) => (
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-4 w-[450px]"
      >
        <AddressForm {...args} />
        <Button type="submit">Submit</Button>
      </form>
    )}
  </FormValidation>
);

export const ShippingAddress = Template.bind({});
ShippingAddress.args = {
  prefix: 'shippingAddress',
  label: 'Shipping Address',
};

export const BillingAddress = Template.bind({});
BillingAddress.args = {
  prefix: 'billingAddress',
  label: 'Billing Address',
};
