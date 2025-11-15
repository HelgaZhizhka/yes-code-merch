import type { Address, AddressType } from '@entities/address';
import { defaultAddress } from '@entities/address';
import type { CustomerData, ProfileFormType } from '@entities/customer';

import {
  createAppStore,
  type ImmerCompatibleSet,
} from '@shared/lib/create-app-store';

import type { AddressStepFormType } from './schema';

export const StepKey = ['profile', 'address'] as const;

export type StepKeyType = (typeof StepKey)[number];

interface FormState {
  formData: {
    profile: ProfileFormType;
    address: AddressStepFormType;
  };
  isShippingAsBilling: boolean;
  setFormData<T extends keyof FormState['formData']>(
    stepKey: T,
    data: FormState['formData'][T]
  ): void;
  setIsShippingAsBilling(value: boolean): void;
  resetForm(): void;
  getCustomerData(email: string | null): CustomerData;
  getShippingAddressPayload(): {
    address: Address;
    addressType: AddressType;
  };
  getBillingAddressPayload(): {
    address: Address;
    addressType: AddressType;
  } | null;
}

export const defaultProfile: ProfileFormType = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  phone: '',
  title: '',
  company: '',
};

export const defaultAddressStep: AddressStepFormType = {
  shippingAddresses: [defaultAddress],
  billingAddresses: [],
  isShippingAsBilling: true,
};

export const useFormStore = createAppStore<FormState>(
  (set: ImmerCompatibleSet<FormState>, get) => ({
    formData: {
      profile: defaultProfile,
      address: defaultAddressStep,
    },
    isShippingAsBilling: true,
    setIsShippingAsBilling(value: boolean) {
      set((state: FormState) => {
        state.isShippingAsBilling = value;
      });
    },
    setFormData<T extends keyof FormState['formData']>(
      stepKey: T,
      data: FormState['formData'][T]
    ) {
      set((state: FormState) => {
        state.formData[stepKey] = data;
      });
    },
    resetForm: () =>
      set((state: FormState) => {
        state.formData.profile = defaultProfile;
        state.formData.address = defaultAddressStep;
        state.isShippingAsBilling = true;
      }),
    getCustomerData: (email: string) => {
      const formData = get().formData;
      const profile = formData?.profile ?? defaultProfile;

      return {
        email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth,
        title: profile.title,
        company: profile.company,
      };
    },
    getShippingAddressPayload: () => {
      const formData = get().formData?.address;
      const address = formData?.shippingAddresses[0] ?? defaultAddress;

      return {
        address,
        addressType: 'shipping',
      };
    },
    getBillingAddressPayload: () => {
      const { formData, isShippingAsBilling } = get();
      const addressStep = formData?.address;

      if (isShippingAsBilling) {
        const shippingAddress =
          addressStep?.shippingAddresses?.[0] ?? defaultAddress;

        return {
          address: shippingAddress,
          addressType: 'billing',
        };
      }

      const billingAddress =
        addressStep?.billingAddresses?.[0] ?? defaultAddress;

      return {
        address: billingAddress,
        addressType: 'billing',
      };
    },
  }),
  {
    name: 'onboarding-form-storage',
    enablePersist: true,
    partialize: (state: FormState) => ({
      formData: state.formData,
      isShippingAsBilling: state.isShippingAsBilling,
    }),
    useSessionStorage: true,
    enableImmer: true,
  }
);
