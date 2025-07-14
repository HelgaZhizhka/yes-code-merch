import { render, screen } from '@testing-library/react';
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
  it('renders inputs and submit button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('disables submit button and shows loading when isPending is true', () => {
    isPending = true;
    render(<LoginForm />);
    const button = screen.getByRole('button', { name: /logging in.../i });
    expect(button).toBeDisabled();
  });
});
