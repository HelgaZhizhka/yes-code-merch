import type { Decorator } from '@storybook/react-vite';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import '../src/app/styles/index.css';

export const withStyleDecorator: Decorator = (Story: React.FC) => {
  return <Story />;
};

export const WithFormProvider: Decorator = (Story: React.FC) => {
  const methods = useForm({
    defaultValues: {
      shippingAddresses: [
        {
          country: '',
          city: '',
          streetName: '',
          streetNumber: '',
          postalCode: '',
          isDefault: false,
        },
      ],
      billingAddresses: [
        {
          country: '',
          city: '',
          streetName: '',
          streetNumber: '',
          postalCode: '',
          isDefault: false,
        },
      ],
      useShippingAsBilling: true,
    },
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <Story />
    </FormProvider>
  );
};
