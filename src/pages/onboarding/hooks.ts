import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { defaultAddress, useCreateAddress } from '@entities/address';
import {
  profileSchema,
  useUpdateCustomer,
  type ProfileFormType,
} from '@entities/customer';

import { ONBOARDING_STEPS, ROUTES } from '@shared/config/routes';
import { useViewerEmail } from '@shared/viewer/model';

import {
  defaultAddressStep,
  defaultProfile,
  StepKey,
  useFormStore,
  type StepKeyType,
} from './model';
import { addressStepSchema, type AddressStepFormType } from './model/schema';

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
    schema: addressStepSchema,
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
    isShippingAsBilling,
    setIsShippingAsBilling,
    setFormData,
    resetForm,
  } = useFormStore();
  const { mutateAsync: createAddress } = useCreateAddress();
  const { mutateAsync: updateCustomer } = useUpdateCustomer();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepKey = getStepKeyFromUrl(routerState.location.pathname);
  const currentStepIndex = getStepIndexByKey(currentStepKey);
  const currentStep = STEPS[currentStepIndex];

  const form = useForm<ProfileFormType | AddressStepFormType>({
    resolver: zodResolver(currentStep.schema),
    defaultValues: formData[currentStep.key] ?? currentStep.defaultValues,
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const handleSubmit = useCallback(async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    if (isSubmitting) {
      return;
    }

    setFormData(currentStep.key, form.getValues());

    let customerData;
    let shippingPayload;
    let billingPayload;

    try {
      customerData = useFormStore.getState().getCustomerData(email);
      shippingPayload = useFormStore.getState().getShippingAddressPayload();
      billingPayload = useFormStore.getState().getBillingAddressPayload();
    } catch {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateCustomer(customerData);
      toast.success('Profile created!');

      await createAddress(shippingPayload);
      toast.success('Shipping address saved!');

      if (billingPayload !== null) {
        await createAddress(billingPayload);
        toast.success('Billing address saved!');
      }

      toast.success('🎉 Registration completed successfully!');
      resetForm();

      navigate({
        to: ROUTES.HOME,
        viewTransition: { types: ['slide-fade'] },
      });
    } catch (error) {
      console.error('Registration failed:', error);

      if (error instanceof Error) {
        toast.error('Registration could not be completed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    form,
    setFormData,
    currentStep,
    updateCustomer,
    navigate,
    resetForm,
    email,
    createAddress,
    isSubmitting,
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
      setIsShippingAsBilling(checked);

      if (checked) {
        form.setValue('billingAddresses', []);
        form.trigger('shippingAddresses');
      } else {
        form.setValue('billingAddresses', [defaultAddress]);
        form.trigger('billingAddresses');
      }
    },
    [form, setIsShippingAsBilling]
  );

  return {
    form,
    isShippingAsBilling,
    handleUseShippingAsBillingChange,
    handleNextStep,
    handleBack,
    currentStepKey,
    handleSubmit,
    isSubmitting,
  };
};
