import type { Address } from '@shared/api/auth/interfaces';
import { createAppStore } from '@shared/lib/create-app-store';

import type { ProfileFormType } from './model/validation-schema';

interface FormState {
  formData: ProfileFormType | null;
  setFormData(data: ProfileFormType): void;
  resetForm(): void;
}

const defaultAddress = {
  country: '',
  city: '',
  streetName: '',
  streetNumber: '',
  postalCode: '',
  isDefault: false,
};

const processAddresses = (addresses: Address[] | undefined) =>
  (addresses ?? []).map((addr) => ({
    ...defaultAddress,
    ...addr,
  }));

export const useFormStore = createAppStore<FormState>(
  (set) => ({
    formData: null,
    setFormData: (data: ProfileFormType) => {
      const shippingAddresses = processAddresses(data.shippingAddresses);
      const billingAddresses = processAddresses(data.billingAddresses);
      set((state: FormState) => ({
        formData: {
          ...state.formData,
          ...data,
          shippingAddresses:
            shippingAddresses.length > 0
              ? shippingAddresses
              : (state.formData?.shippingAddresses ?? [defaultAddress]),
          billingAddresses:
            billingAddresses.length > 0
              ? billingAddresses
              : (state.formData?.billingAddresses ?? [defaultAddress]),
        },
      }));
    },
    resetForm: () =>
      set({
        formData: null,
      }),
  }),
  {
    name: 'onboarding-form-storage',
    partialize: (state: FormState) => ({
      formData: state.formData,
    }),
    useSessionStorage: true,
  }
);
