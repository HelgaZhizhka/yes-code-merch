import type { Viewer } from '@shared/api/auth/interfaces';
import { createAppStore } from '@shared/lib/create-app-store';
import { type ProfileFormType } from '@shared/lib/schemas';
import { defaultAddress } from '@shared/lib/validators';

import type { AddressStepFormType } from './schema';

export type StepKey = 'profile' | 'address';

interface FormState {
  formData: {
    profile?: ProfileFormType;
    address?: AddressStepFormType;
  };
  setFormData(
    stepKey: StepKey,
    data: ProfileFormType | AddressStepFormType
  ): void;
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
  (set, get) => ({
    formData: {},
    setFormData: (
      stepKey: StepKey,
      data: ProfileFormType | AddressStepFormType
    ) => {
      set((state: FormState) => ({
        formData: {
          ...state.formData,
          [stepKey]: {
            ...state.formData[stepKey],
            ...data,
          },
        },
      }));
    },
    resetForm: () => set({ formData: {} }),
    getViewer: (email: string) => {
      const formData = get().formData;
      const profile = formData.profile ?? defaultProfile;
      const address = formData.address ?? defaultAddressStep;

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
    partialize: (state: FormState) => ({
      formData: state.formData,
    }),
    useSessionStorage: true,
  }
);
