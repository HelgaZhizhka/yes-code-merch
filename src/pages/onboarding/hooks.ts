import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ONBOARDING_STEPS } from '@shared/config/routes';
import { useCompleteRegistration } from '@shared/viewer/hooks';

import { useFormStore } from './model';
import {
  addressSchema,
  profileSchema,
  type AddressFormType,
  type ProfileFormType,
} from './model/validation-schema';

export const useOnboardingForm = () => {
  const { mutate: completeRegistration, isPending } = useCompleteRegistration();
  const { formData } = useFormStore();

  const navigate = useNavigate();

  const onSubmit = async () => {
    // Объединяем данные profile и address в один объект для отправки
    const payload = {
      ...formData.profile,
      ...formData.address,
      // TODO: Добавить обязательные поля, которых нет в formData, например email
    };

    completeRegistration(payload, {
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success('Registration successful');
        navigate({ to: ONBOARDING_STEPS.INIT });
      },
    });
  };

  return {
    onSubmit,
    isPending,
  };
};

const STEPS = [
  {
    key: 'profile',
    route: ONBOARDING_STEPS.INIT,
    schema: profileSchema,
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phone: '',
      title: '',
      company: '',
    },
  },
  {
    key: 'address',
    route: ONBOARDING_STEPS.ADDRESS,
    schema: addressSchema,
    defaultValues: {
      streetName: '',
      streetNumber: '',
      city: '',
      postalCode: '',
      country: '',
      isDefault: false,
    },
  },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

const getStepKeyFromUrl = (url: string): StepKey => {
  const currentPath = url.split('?')[0];
  const step = STEPS.find((s) => s.route === currentPath);
  return step?.key ?? 'profile';
};

const getStepIndexByKey = (key: StepKey): number => {
  return STEPS.findIndex((s) => s.key === key);
};

export const useFormStep = () => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { formData, setFormData } = useFormStore();
  const { onSubmit, isPending } = useOnboardingForm();

  const currentStepKey = getStepKeyFromUrl(routerState.location.pathname);
  const currentStepIndex = getStepIndexByKey(currentStepKey);

  const currentStep = STEPS[currentStepIndex];

  const form = useForm<ProfileFormType | AddressFormType>({
    resolver: zodResolver(currentStep.schema),
    defaultValues: formData[currentStep.key] ?? currentStep.defaultValues,
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const handleSubmit = useCallback(async () => {
    setFormData(currentStep.key, form.getValues());
    await onSubmit();
  }, [form, setFormData, currentStep.key, onSubmit]);

  const handleNextStep = useCallback(() => {
    const values = form.getValues();
    setFormData(currentStep.key, values);

    const nextStep = STEPS[currentStepIndex + 1];

    if (!nextStep) {
      return;
    }

    navigate({ to: nextStep.route });
  }, [form, currentStep, currentStepIndex, setFormData, navigate]);

  const handleBack = useCallback(() => {
    const values = form.getValues();
    setFormData(currentStep.key, values);

    const prevStep = STEPS[currentStepIndex - 1];

    if (!prevStep) {
      return;
    }

    navigate({ to: prevStep.route });
  }, [form, currentStep, currentStepIndex, setFormData, navigate]);

  return {
    form,
    handleNextStep,
    handleBack,
    currentStepKey,
    handleSubmit,
    isPending,
  };
};
