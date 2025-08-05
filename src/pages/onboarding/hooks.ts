import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ONBOARDING_STEPS, ROUTES } from '@shared/config/routes';
import { profileSchema, type ProfileFormType } from '@shared/lib/schemas';
import { defaultAddress } from '@shared/lib/validators';
import { useCompleteRegistration } from '@shared/viewer/hooks';
import { useViewerEmail } from '@shared/viewer/model';

import {
  defaultAddressStep,
  defaultProfile,
  StepKey,
  useFormStore,
  type StepKeyType,
} from './model';
import {
  addresStepSchema,
  viewerSchema,
  type AddressStepFormType,
} from './model/schema';

const STEPS = [
  {
    key: StepKey[0],
    route: ONBOARDING_STEPS.INIT,
    schema: profileSchema,
    defaultValues: defaultProfile,
  },
  {
    key: StepKey[1],
    route: ONBOARDING_STEPS.ADDRESS,
    schema: addresStepSchema,
    defaultValues: defaultAddressStep,
  },
] as const;

const getStepKeyFromUrl = (url: string): StepKeyType => {
  const currentPath = url.split('?')[0];
  const step = STEPS.find((s) => s.route === currentPath);
  return step?.key ?? StepKey[0];
};

const getStepIndexByKey = (key: StepKeyType): number => {
  return STEPS.findIndex((s) => s.key === key);
};

export const useFormStep = () => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const email = useViewerEmail();
  const {
    formData,
    useShippingAsBilling,
    setUseShippingAsBilling,
    setFormData,
    resetForm,
  } = useFormStore();
  const { mutate: completeRegistration, isPending } = useCompleteRegistration();

  const currentStepKey = getStepKeyFromUrl(routerState.location.pathname);
  const currentStepIndex = getStepIndexByKey(currentStepKey);
  const currentStep = STEPS[currentStepIndex];

  const form = useForm<ProfileFormType | AddressStepFormType>({
    resolver: zodResolver(currentStep.schema),
    defaultValues: formData[currentStep.key] ?? currentStep.defaultValues,
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const handleSubmit = useCallback(() => {
    setFormData(currentStep.key, form.getValues());

    if (!email) {
      toast.error('Email is required');
      return;
    }

    const viewer = useFormStore.getState().getViewer(email);
    const result = viewerSchema.safeParse(viewer);

    if (!result.success) {
      toast.error('You should fill all fields from previous steps');
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
    email,
  ]);

  const handleNextStep = useCallback(() => {
    const values = form.getValues();
    setFormData(currentStep.key, values);
    const nextStep = STEPS[currentStepIndex + 1];

    if (!nextStep) {
      return;
    }

    navigate({
      to: nextStep.route,
      viewTransition: { types: ['slide-fade'] },
    });
  }, [form, currentStepIndex, setFormData, navigate, currentStep]);

  const handleBack = useCallback(() => {
    const values = form.getValues();
    setFormData(currentStep.key, values);

    const prevStep = STEPS[currentStepIndex - 1];

    if (!prevStep) {
      return;
    }

    navigate({
      to: prevStep.route,
      viewTransition: { types: ['slide-fade'] },
    });
  }, [form, currentStepIndex, setFormData, navigate, currentStep]);

  const handleUseShippingAsBillingChange = useCallback(
    (checked: boolean) => {
      setUseShippingAsBilling(checked);

      if (checked) {
        form.setValue('billingAddresses', []);
        form.trigger('shippingAddresses');
      } else {
        form.setValue('billingAddresses', [defaultAddress]);
        form.trigger('billingAddresses');
      }
    },
    [form, setUseShippingAsBilling]
  );

  return {
    form,
    useShippingAsBilling,
    handleUseShippingAsBillingChange,
    handleNextStep,
    handleBack,
    currentStepKey,
    handleSubmit,
    isPending,
  };
};
