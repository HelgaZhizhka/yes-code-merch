import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { ROUTES, STEP_TO_ROUTE } from '@shared/config/routes';
import { useRegister } from '@shared/viewer/hooks';

import { useFormStore } from './model';

export const useSubmitForm = () => {
  const navigate = useNavigate();
  const { mutate: register, isPending, error } = useRegister();
  const { formData, resetForm } = useFormStore();

  const handleFormSubmit = async () => {
    console.log('submit registration');
    if (!formData) return;

    register(formData, {
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success('Registration successful');
        navigate({ to: ROUTES.HOME });
      },
    });
    resetForm();
  };

  return {
    handleFormSubmit,
    isPending,
    error,
  };
};

interface FormStep {
  currentStep: number;
  setCurrentStep(step: number): void;
  handleNextStep(): void;
  handleBack(): void;
  handleConfirm(): void;
}

export const useFormStep = (): FormStep => {
  const navigate = useNavigate();
  //TODO handle form data with React hook forms
  const { currentStep, setCurrentStep } = useFormStore();
  const { handleFormSubmit } = useSubmitForm();

  const handleNextStep = () => {
    const nextStep = currentStep + 1;
    // TODO should implement setFormData(data);
    console.log('next step', nextStep);
    setCurrentStep(nextStep);
    navigate({ to: STEP_TO_ROUTE[nextStep] });
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    console.log('prev step', prevStep);
    setCurrentStep(prevStep);
    // TODO should implement setFormData(data);
    navigate({ to: STEP_TO_ROUTE[prevStep] });
  };

  const handleConfirm = () => {
    handleFormSubmit();
    console.log('confirm step');
  };

  return {
    handleNextStep,
    handleBack,
    currentStep,
    setCurrentStep,
    handleConfirm,
  };
};
