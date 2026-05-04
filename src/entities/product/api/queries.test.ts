import { describe, expect, it } from 'vitest';

import { productQueries } from './queries';

describe('productQueries', () => {
  it('produces a deterministic catalog query key including all params', () => {
    const opts = productQueries.catalog({
      categoryIds: ['cat-1'],
      colors: ['black'],
      page: 2,
    });

    expect(opts.queryKey[0]).toBe('products');
    expect(opts.queryKey[1]).toBe('catalog');
    expect(opts.queryKey[2]).toMatchObject({
      categoryIds: ['cat-1'],
      colors: ['black'],
      page: 2,
    });
  });

  it('produces a deterministic filter-options query key', () => {
    const opts = productQueries.filterOptions(['cat-1', 'cat-2']);

    expect(opts.queryKey).toEqual([
      'products',
      'filter-options',
      ['cat-1', 'cat-2'],
    ]);
  });
});
