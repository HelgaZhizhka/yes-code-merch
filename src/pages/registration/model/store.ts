import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { RegisterDTO } from '@/shared/api/auth/interfaces';

interface RegistrationFormState {
  currentStep: number;
  formData: RegisterDTO | null;
  setCurrentStep(step: number): void;
  setFormData(data: RegisterDTO): void;
  resetForm(): void;
  getLatestState(): RegistrationFormState;
}

export const INIT_STEP = 1;

const getStorageData = (): RegistrationFormState | null => {
  try {
    const data = localStorage.getItem('registrationForm');

    if (!data) return null;

    return JSON.parse(data) as RegistrationFormState;
  } catch (error) {
    console.error('Error getting storage data:', error);
    return null;
  }
};

export const useRegistrationFormStore = create<RegistrationFormState>()(
  devtools(
    persist(
      (set, get) => ({
        currentStep: INIT_STEP,
        formData: null,
        setCurrentStep: (step: number) => set({ currentStep: step }),
        setFormData: (data: RegisterDTO) =>
          set((state: RegistrationFormState) => ({
            formData: { ...state.formData, ...data },
          })),
        resetForm: () => set({ currentStep: 1, formData: null }),
        getLatestState: () => getStorageData() || get(),
      }),
      {
        name: 'registration-form-storage',
        partialize: (state: RegistrationFormState) => ({
          formData: state.formData,
        }),
      }
    ),
    {
      name: 'registration-form-storage',
    }
  )
);
