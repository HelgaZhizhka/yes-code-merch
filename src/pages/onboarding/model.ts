import { createAppStore } from '@shared/lib/create-app-store';

import type {
  AddressFormType,
  ProfileFormType,
} from './model/validation-schema';

interface FormState {
  formData: {
    profile?: ProfileFormType;
    address?: AddressFormType;
  };
  setFormData(
    stepKey: 'profile' | 'address',
    data: ProfileFormType | AddressFormType
  ): void;
  resetForm(): void;
}

export const useFormStore = createAppStore<FormState>(
  (set) => ({
    formData: {},
    setFormData: (
      stepKey: 'profile' | 'address',
      data: ProfileFormType | AddressFormType
    ) =>
      set((state: FormState) => ({
        formData: {
          ...state.formData,
          [stepKey]: {
            ...state.formData[stepKey],
            ...data,
          },
        },
      })),
    resetForm: () => set({ formData: {} }),
  }),
  {
    name: 'onboarding-form-storage',
    partialize: (state: FormState) => ({
      formData: state.formData,
    }),
    useSessionStorage: true,
  }
);
