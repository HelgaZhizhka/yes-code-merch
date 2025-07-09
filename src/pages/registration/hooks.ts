import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { RegisterDTO } from '@shared/api/auth/interfaces';
import { STEP_TO_ROUTE } from '@shared/config/routes';
import { useRegister } from '@shared/viewer/hooks';

import { useRegistrationFormStore } from './model/store';

export const useRegistrationForm = () => {
  const { mutate: register, isPending, error } = useRegister();

  const initProfile: RegisterDTO = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    title: '',
    dateOfBirth: '',
    company: '',
    shippingAddresses: [],
    billingAddresses: [],
    useShippingAsBilling: false,
  };

  const [profile, setProfile] = useState<RegisterDTO>(initProfile);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profile) return;

    register(profile);
  };

  return {
    handleSubmit,
    isPending,
    error,
    profile,
    setProfile,
  };
};

export const useFormStep = (): {
  currentStep: number;
  form: ReturnType<typeof useForm>;
  handleNextStep: (data: unknown) => void;
  handleBack: () => void;
} => {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep, setFormData, getLatestState } =
    useRegistrationFormStore();

  const form = useForm({
    mode: 'onChange',
    defaultValues: getLatestState().formData,
  });

  const handleNextStep = (data: unknown) => {
    const nextStep = currentStep + 1;
    setFormData(data);
    setCurrentStep(nextStep);
    navigate({ to: STEP_TO_ROUTE[nextStep] });
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    const currentValues = form.getValues();
    setFormData(currentValues);
    setCurrentStep(prevStep);
    navigate({ to: STEP_TO_ROUTE[prevStep] });
  };

  return {
    form,
    handleNextStep,
    handleBack,
    currentStep,
  };
};
