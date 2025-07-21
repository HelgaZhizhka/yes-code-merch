import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ROUTES, STEP_TO_ROUTE } from '@shared/config/routes';
import { useRegister } from '@shared/viewer/hooks';

import type { RegisterDTO } from '@/shared/api/auth/interfaces';

import { INIT_STEP, useFormStore } from './model';
import {
  initStepSchema,
  registrationSchema,
  type InitStepType,
} from './model/validation-schema';

export const useSubmitForm = () => {
  const navigate = useNavigate();
  const { mutate: register, isPending, error } = useRegister();
  const { formData, resetForm } = useFormStore();

  const handleFormSubmit = async () => {
    if (!formData) return;

    register(formData as RegisterDTO, {
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
  form: ReturnType<typeof useForm<InitStepType>>;
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

const getSchemaForStep = (step: number) => {
  if (step === 1) {
    return initStepSchema;
  }
  return registrationSchema;
};

export const useFormStep = (): FormStep => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { currentStep, setCurrentStep, formData, setFormData } = useFormStore();
  const { handleFormSubmit } = useSubmitForm();

  useEffect(() => {
    const currentUrl = routerState.location.pathname;
    const urlStep = getStepFromUrl(currentUrl);

    if (currentStep !== urlStep) {
      setCurrentStep(urlStep);
    }
  }, [routerState.location.pathname, currentStep, setCurrentStep]);

  const schema = getSchemaForStep(currentStep);

  const form = useForm<InitStepType>({
    resolver: zodResolver(schema),
    defaultValues: formData ?? {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const handleNextStep = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    const values = form.getValues();
    setFormData(values);
    navigate({ to: STEP_TO_ROUTE[nextStep] });
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    const values = form.getValues();
    setFormData(values);
    navigate({ to: STEP_TO_ROUTE[prevStep] });
  };

  const handleConfirm = () => {
    handleFormSubmit();
  };

  return {
    form,
    handleNextStep,
    handleBack,
    currentStep,
    setCurrentStep,
    handleConfirm,
  };
};
