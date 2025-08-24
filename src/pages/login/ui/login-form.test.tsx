import { render, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, it, expect, vi } from 'vitest';

import { LoginForm } from '@pages/login/ui/login-form';

let isPending = false;

vi.mock('@pages/login/hooks', () => ({
  useLoginForm: () => {
    return {
      form: useForm({
        defaultValues: { email: '', password: '' },
        mode: 'onChange',
      }),
      onSubmit: vi.fn(),
      isPending: isPending,
    };
  },
}));

describe('LoginForm', () => {
  it('renders inputs and submit button', async () => {
    render(<LoginForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).toBeInTheDocument();
    });
  });

  it('disables submit button and shows loading when isPending is true', async () => {
    isPending = true;
    render(<LoginForm />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /signing in.../i });
      expect(button).toBeDisabled();
    });
  });
});
