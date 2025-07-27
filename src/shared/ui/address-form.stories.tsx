import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';

import type { AddressFormType } from '@shared/lib/schemas';
import { defaultAddress } from '@shared/lib/validators';
import { AddressForm, type AddressFormProps } from '@shared/ui/address-form';
import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';

const meta: Meta<typeof AddressForm> = {
  title: 'shared/ui/form/address',
  component: AddressForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    prefix: { control: 'text' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof AddressForm>;

const onSubmit = (data: AddressFormType) => {
  console.log('Form Data:', data);
};

export const Default: Story = {
  args: {
    prefix: 'shippingAddress',
    label: 'Shipping Address',
  },
  render: (args: AddressFormProps) => {
    const methods = useForm<AddressFormType>({
      defaultValues: defaultAddress,
      mode: 'onChange',
      criteriaMode: 'all',
      shouldUnregister: true,
    });

    return (
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <AddressForm {...args} />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

export const BillingAddress: Story = {
  args: {
    prefix: 'billingAddresses',
    label: 'Billing Address',
  },
};
