import { describe, expect, it, vi, beforeEach } from 'vitest';

import { getFilterOptions } from './filter-options';

const rpcMock = vi.fn();

vi.mock('@shared/api/supabase-client', () => ({
  supabase: {
    rpc: (...args: unknown[]) => rpcMock(...args),
  },
}));

describe('getFilterOptions', () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it('maps RPC payload to FilterOptions and supplies defaults for nullable fields', async () => {
    rpcMock.mockReturnValue({
      single: () =>
        Promise.resolve({
          data: {
            colors: ['black', 'white'],
            sizes: ['m', 'l'],
            price_min: 1000,
            price_max: 5000,
            has_size_filter: true,
          },
          error: null,
        }),
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
    rpcMock.mockReturnValue({
      single: () =>
        Promise.resolve({
          data: {
            colors: null,
            sizes: null,
            price_min: null,
            price_max: null,
            has_size_filter: false,
          },
          error: null,
        }),
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

  it('throws when RPC returns an error', async () => {
    rpcMock.mockReturnValue({
      single: () =>
        Promise.resolve({
          data: null,
          error: { message: 'rpc failed' },
        }),
    });

    await expect(getFilterOptions(['cat-1'])).rejects.toMatchObject({
      message: 'rpc failed',
    });
  });
});
