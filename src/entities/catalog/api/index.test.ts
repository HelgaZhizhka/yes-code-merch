import { describe, expect, it, vi, beforeEach } from 'vitest';

import { getFilterOptions } from './';

const rpcMock = vi.fn();

vi.mock('@shared/api/supabase-client', () => ({
  supabase: {
    rpc: (...args: unknown[]) => rpcMock(...args),
  },
}));

const mockRpcResponse = (data: unknown): void => {
  rpcMock.mockReturnValue({
    single: () => ({
      throwOnError: () => Promise.resolve({ data, error: null }),
    }),
  });
};

describe('getFilterOptions', () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it('maps RPC payload to FilterOptions and supplies defaults for nullable fields', async () => {
    mockRpcResponse({
      colors: ['black', 'white'],
      sizes: ['m', 'l'],
      price_min: 1000,
      price_max: 5000,
      has_size_filter: true,
    });

    const result = await getFilterOptions(['cat-1']);

    expect(rpcMock).toHaveBeenCalledWith('get_catalog_filter_options', {
      p_category_ids: ['cat-1'],
    });
    expect(result).toEqual({
      colors: ['black', 'white'],
      sizes: ['m', 'l'],
      priceMin: 1000,
      priceMax: 5000,
      hasSizeFilter: true,
    });
  });

  it('returns empty arrays and zero range when RPC returns nulls', async () => {
    mockRpcResponse({
      colors: null,
      sizes: null,
      price_min: null,
      price_max: null,
      has_size_filter: false,
    });

    const result = await getFilterOptions(['cat-1']);

    expect(result).toEqual({
      colors: [],
      sizes: [],
      priceMin: 0,
      priceMax: 0,
      hasSizeFilter: false,
    });
  });
});
