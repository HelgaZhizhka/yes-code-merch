import type { Viewer } from '@shared/api/auth';
import {
  createAppStore,
  type ImmerCompatibleSet,
} from '@shared/lib/create-app-store';
import { type ProfileFormType } from '@shared/lib/schemas';
import { defaultAddress } from '@shared/lib/validators';

import type { AddressStepFormType } from './schema';

export const StepKey = ['profile', 'address'] as const;

export type StepKeyType = (typeof StepKey)[number];

interface FormState {
  formData: {
    profile: ProfileFormType;
    address: AddressStepFormType;
  };
  useShippingAsBilling: boolean;
  setFormData<T extends keyof FormState['formData']>(
    stepKey: T,
    data: FormState['formData'][T]
  ): void;
  setUseShippingAsBilling(value: boolean): void;
  resetForm(): void;
  getViewer(email: string | null): Viewer;
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
  useShippingAsBilling: true,
};

export const useFormStore = createAppStore<FormState>(
  (set: ImmerCompatibleSet<FormState>, get) => ({
    formData: {
      profile: defaultProfile,
      address: defaultAddressStep,
    },
    useShippingAsBilling: true,
    setUseShippingAsBilling(value: boolean) {
      set((state: FormState) => {
        state.useShippingAsBilling = value;
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
        state.useShippingAsBilling = true;
      }),
    getViewer: (email: string) => {
      const formData = get().formData;
      const profile = formData?.profile ?? defaultProfile;
      const address = formData?.address ?? defaultAddressStep;

      const shippingAddress = address.shippingAddresses[0] ?? defaultAddress;
      const billingAddress = address.useShippingAsBilling
        ? shippingAddress
        : (address.billingAddresses?.[0] ?? defaultAddress);

      return {
        email,
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        phone: profile.phone ?? '',
        dateOfBirth: profile.dateOfBirth ?? '',
        title: profile.title,
        company: profile.company,
        shippingAddresses: [shippingAddress],
        billingAddresses: [billingAddress],
        useShippingAsBilling: address.useShippingAsBilling ?? true,
      };
    },
  }),
  {
    name: 'onboarding-form-storage',
    enablePersist: true,
    partialize: (state: FormState) => ({
      formData: state.formData,
      useShippingAsBilling: state.useShippingAsBilling,
    }),
    useSessionStorage: true,
    enableImmer: true,
  }
);
