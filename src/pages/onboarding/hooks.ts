import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ONBOARDING_STEPS, ROUTES } from '@shared/config/routes';
import { profileSchema, type ProfileFormType } from '@shared/lib/schemas';
import { useCompleteRegistration } from '@shared/viewer/hooks';

import { defaultAddressStep, defaultProfile, useFormStore } from './model';
import {
  addresStepSchema,
  viewerSchema,
  type AddressStepFormType,
} from './model/schema';

// TODO: 

const STEPS = [
  {
    key: 'profile',
    route: ONBOARDING_STEPS.INIT,
    schema: profileSchema,
    defaultValues: defaultProfile,
  },
  {
    key: 'address',
    route: ONBOARDING_STEPS.ADDRESS,
    schema: addresStepSchema,
    defaultValues: defaultAddressStep,
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
  const { formData, setFormData, resetForm } = useFormStore();
  const { mutate: completeRegistration, isPending } = useCompleteRegistration();

  const currentStepKey = getStepKeyFromUrl(routerState.location.pathname);
  const currentStepIndex = getStepIndexByKey(currentStepKey);
  const currentStep = STEPS[currentStepIndex];

  const form = useForm<ProfileFormType | AddressStepFormType>({
    resolver: zodResolver(currentStep.schema),
    defaultValues: formData?.[currentStep.key] ?? currentStep.defaultValues,
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const handleSubmit = useCallback(() => {
    setFormData(currentStep.key, form.getValues());

    const viewer = useFormStore.getState().getViewer();
    const result = viewerSchema.safeParse(viewer);

    if (!result.success) {
      return;
    }

    completeRegistration(viewer, {
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success('Registration completed successfully');
        resetForm();
        navigate({ to: ROUTES.HOME });
      },
    });
  }, [
    form,
    setFormData,
    currentStep,
    completeRegistration,
    navigate,
    resetForm,
  ]);

  const handleNextStep = useCallback(() => {
    const values = form.getValues();
    setFormData(currentStep.key, values);
    const nextStep = STEPS[currentStepIndex + 1];

    if (!nextStep) {
      return;
    }

    navigate({ to: nextStep.route });
  }, [form, currentStepIndex, setFormData, navigate, currentStep]);

  const handleBack = useCallback(() => {
    const values = form.getValues();
    setFormData(currentStep.key, values);

    const prevStep = STEPS[currentStepIndex - 1];

    if (!prevStep) {
      return;
    }

    navigate({ to: prevStep.route });
  }, [form, currentStepIndex, setFormData, navigate, currentStep]);

  return {
    form,
    handleNextStep,
    handleBack,
    currentStepKey,
    handleSubmit,
    isPending,
  };
};
