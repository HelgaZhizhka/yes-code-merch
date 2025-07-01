import { useState } from 'react';

import type { RegisterDTO } from '@shared/api/auth/interfaces';
import { useRegister } from '@shared/viewer/hooks';

export const useRegistrationForm = () => {
  const { mutate: register, isPending, error } = useRegister();

  const initProfile: RegisterDTO = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    shippingAddress: {
      country: '',
      city: '',
      street: '',
      postal_code: '',
    },
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
