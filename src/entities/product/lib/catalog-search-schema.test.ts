import { describe, expect, it } from 'vitest';

import { catalogSearchSchema } from './catalog-search-schema';

describe('catalogSearchSchema', () => {
  describe('defaults', () => {
    it('should set default values when parsing empty object', () => {
      const result = catalogSearchSchema.parse({});
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(12);
      expect(result.sortField).toBe('created_at');
      expect(result.sortDirection).toBe('desc');
    });

    it('should preserve provided values over defaults', () => {
      const result = catalogSearchSchema.parse({
        page: 3,
        sortField: 'price',
        sortDirection: 'asc',
      });
      expect(result.page).toBe(3);
      expect(result.sortField).toBe('price');
      expect(result.sortDirection).toBe('asc');
    });
  });

  describe('page', () => {
    it('should reject non-positive page', () => {
      expect(catalogSearchSchema.safeParse({ page: 0 }).success).toBe(false);
      expect(catalogSearchSchema.safeParse({ page: -1 }).success).toBe(false);
    });

    it('should reject non-integer page', () => {
      expect(catalogSearchSchema.safeParse({ page: 1.5 }).success).toBe(false);
    });
  });

  describe('search', () => {
    it('should accept optional string', () => {
      const result = catalogSearchSchema.parse({ search: 'shirt' });
      expect(result.search).toBe('shirt');
    });

    it('should be undefined when not provided', () => {
      const result = catalogSearchSchema.parse({});
      expect(result.search).toBeUndefined();
    });
  });

  describe('price range', () => {
    it('should accept valid price range', () => {
      const result = catalogSearchSchema.parse({
        priceMin: 500,
        priceMax: 2000,
      });
      expect(result.priceMin).toBe(500);
      expect(result.priceMax).toBe(2000);
    });

    it('should reject negative prices', () => {
      expect(catalogSearchSchema.safeParse({ priceMin: -100 }).success).toBe(
        false
      );
      expect(catalogSearchSchema.safeParse({ priceMax: -50 }).success).toBe(
        false
      );
    });

    it('should accept zero as priceMin', () => {
      const result = catalogSearchSchema.parse({ priceMin: 0 });
      expect(result.priceMin).toBe(0);
    });

    it('should be undefined when not provided', () => {
      const result = catalogSearchSchema.parse({});
      expect(result.priceMin).toBeUndefined();
      expect(result.priceMax).toBeUndefined();
    });
  });

  describe('sortField', () => {
    it('should accept valid sort fields', () => {
      const fields = ['name', 'price', 'created_at'];
      for (const field of fields) {
        const result = catalogSearchSchema.parse({ sortField: field });
        expect(result.sortField).toBe(field);
      }
    });

    it('should reject invalid sort field', () => {
      expect(
        catalogSearchSchema.safeParse({ sortField: 'invalid' }).success
      ).toBe(false);
    });
  });

  describe('sortDirection', () => {
    it('should accept asc and desc', () => {
      expect(
        catalogSearchSchema.parse({ sortDirection: 'asc' }).sortDirection
      ).toBe('asc');
      expect(
        catalogSearchSchema.parse({ sortDirection: 'desc' }).sortDirection
      ).toBe('desc');
    });

    it('should reject invalid direction', () => {
      expect(
        catalogSearchSchema.safeParse({ sortDirection: 'random' }).success
      ).toBe(false);
    });
  });
});
