import { describe, expect, it } from 'vitest';

import { catalogQueries } from './queries';

describe('catalogQueries', () => {
  it('produces a deterministic list query key including all params', () => {
    const opts = catalogQueries.list({
      categoryIds: ['cat-1'],
      colors: ['black'],
      page: 2,
    });

    expect(opts.queryKey[0]).toBe('catalog');
    expect(opts.queryKey[1]).toBe('list');
    expect(opts.queryKey[2]).toMatchObject({
      categoryIds: ['cat-1'],
      colors: ['black'],
      page: 2,
    });
  });

  it('produces a deterministic filter-options query key', () => {
    const opts = catalogQueries.filterOptions(['cat-1', 'cat-2']);

    expect(opts.queryKey).toEqual([
      'catalog',
      'filter-options',
      ['cat-1', 'cat-2'],
    ]);
  });
});
