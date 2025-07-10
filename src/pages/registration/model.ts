import type { RegisterDTO } from '@shared/api/auth/interfaces';
import { createAppStore } from '@shared/lib/ create-app-store';

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

export const useFormStore = createAppStore<RegistrationFormState>(
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
    enablePersist: true,
    partialize: (state: RegistrationFormState) => ({
      formData: state.formData,
    }),
  }
);
