import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useLoginForm } from '@pages/login/hooks';

import { MockCredentials } from '@shared/config/test-config';

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
    const data = MockCredentials;

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
