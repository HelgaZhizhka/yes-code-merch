import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useLoginForm } from '@pages/login/hooks';

const loginMock = vi.fn();

vi.mock('@shared/viewer/hooks', () => ({
  useLogin: () => ({
    mutate: loginMock,
    isPending: false,
  }),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

describe('useLoginForm', () => {
  it('calls login with data', async () => {
    const { result } = renderHook(() => useLoginForm());
    const data = {
      email: 'mail@mail.com',
      password: 'Password1!',
    };

    await act(async () => {
      result.current.onSubmit(data);
    });

    expect(loginMock).toHaveBeenCalledWith(
      data,
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });
});
