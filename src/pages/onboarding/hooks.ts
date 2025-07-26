import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ONBOARDING_STEPS } from '@shared/config/routes';
import { useCompleteRegistration } from '@shared/viewer/hooks';

import { useFormStore } from './model';
import { profileSchema, type ProfileFormType } from './model/schema';

const STEPS = [
  {
    key: 'profile',
    route: ONBOARDING_STEPS.INIT,
  },
  {
    key: 'addresses',
    route: ONBOARDING_STEPS.ADDRESS,
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

const defaultValues = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  phone: '',
  title: '',
  company: '',
  shippingAddresses: [
    {
      country: '',
      city: '',
      streetName: '',
      streetNumber: '',
      postalCode: '',
      isDefault: false,
    },
  ],
  billingAddresses: [
    {
      country: '',
      city: '',
      streetName: '',
      streetNumber: '',
      postalCode: '',
      isDefault: false,
    },
  ],
  useShippingAsBilling: true,
};

export const useFormStep = () => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { formData, setFormData } = useFormStore();
  const { mutate: completeRegistration, isPending } = useCompleteRegistration();

  const currentStepKey = getStepKeyFromUrl(routerState.location.pathname);
  const currentStepIndex = getStepIndexByKey(currentStepKey);

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
    defaultValues: formData || defaultValues,
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const handleSubmit = useCallback(async () => {
    setFormData(form.getValues());
    completeRegistration(form.getValues(), {
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success('Registration successful');
        navigate({ to: ONBOARDING_STEPS.INIT });
      },
    });
  }, [form, setFormData, completeRegistration, navigate]);

  const handleNextStep = useCallback(() => {
    const values = form.getValues();
    setFormData(values);

    const nextStep = STEPS[currentStepIndex + 1];

    if (!nextStep) {
      return;
    }

    navigate({ to: nextStep.route });
  }, [form, currentStepIndex, setFormData, navigate]);

  const handleBack = useCallback(() => {
    const values = form.getValues();
    setFormData(values);

    const prevStep = STEPS[currentStepIndex - 1];

    if (!prevStep) {
      return;
    }

    navigate({ to: prevStep.route });
  }, [form, currentStepIndex, setFormData, navigate]);

  return {
    form,
    handleNextStep,
    handleBack,
    currentStepKey,
    handleSubmit,
    isPending,
  };
};
