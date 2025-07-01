import type { RegisterDTO } from '@shared/interfaces';
import { useRegister } from '@shared/viewer/hooks';

export const useRegistrationForm = () => {
  const { mutate: register, isPending, error } = useRegister();

  const testViewer: RegisterDTO = {
    email: 'test@example.com',
    password: '1tT444&4',
    firstName: 'User',
    lastName: 'Test',
    shippingAddress: {
      country: 'RU',
      city: 'Moscow',
      street: '123 Main St',
      postal_code: '10001',
    },
    useShippingAsBilling: true,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register(testViewer);
  };

  return {
    handleSubmit,
    isPending,
    error,
  };
};
