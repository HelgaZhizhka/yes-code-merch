import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { ROUTES, STEP_TO_ROUTE } from '@shared/config/routes';
import { useRegister } from '@shared/viewer/hooks';

import { INIT_STEP, useFormStore } from './model';

// TODO handle form data with React hook forms and step validation

export const useSubmitForm = () => {
  const navigate = useNavigate();
  const { mutate: register, isPending, error } = useRegister();
  const { formData, resetForm } = useFormStore();

  const handleFormSubmit = async () => {
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

const getStepFromUrl = (url: string): number => {
  for (const [step, route] of Object.entries(STEP_TO_ROUTE)) {
    if (url.includes(route)) {
      return Number(step);
    }
  }
  return INIT_STEP;
};

export const useFormStep = (): FormStep => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { currentStep, setCurrentStep } = useFormStore();
  const { handleFormSubmit } = useSubmitForm();

  useEffect(() => {
    const currentUrl = routerState.location.pathname;
    const urlStep = getStepFromUrl(currentUrl);

    if (currentStep !== urlStep) {
      setCurrentStep(urlStep);
    }
  }, [routerState.location.pathname, currentStep, setCurrentStep]);

  const handleNextStep = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    navigate({ to: STEP_TO_ROUTE[nextStep] });
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    navigate({ to: STEP_TO_ROUTE[prevStep] });
  };

  const handleConfirm = () => {
    handleFormSubmit();
  };

  return {
    handleNextStep,
    handleBack,
    currentStep,
    setCurrentStep,
    handleConfirm,
  };
};
