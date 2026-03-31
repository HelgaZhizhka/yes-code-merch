import { describe, expect, it } from 'vitest';

import {
  applyDiscountsToProduct,
  calculateDiscountAmount,
  calculateFinalPrice,
  getActiveDiscounts,
  selectBestDiscount,
} from './calculate-discount';

import type { ProductDiscountDTO } from '../api/types';

const createDiscount = (
  overrides: Partial<ProductDiscountDTO> = {}
): ProductDiscountDTO => ({
  id: '1',
  name: 'Test Discount',
  discount_type: 'percent',
  discount_value: 10,
  priority: 1,
  is_active: true,
  valid_from: null,
  valid_to: null,
  variant_id: null,
  product_id: null,
  ...overrides,
});

describe('getActiveDiscounts', () => {
  it('should filter out inactive discounts', () => {
    const discounts = [
      createDiscount({ id: '1', is_active: true }),
      createDiscount({ id: '2', is_active: false }),
    ];
    const result = getActiveDiscounts(discounts);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should filter out discounts with valid_from in the future', () => {
    const future = new Date('2099-01-01').toISOString();
    const discounts = [createDiscount({ valid_from: future })];
    const result = getActiveDiscounts(discounts);
    expect(result).toHaveLength(0);
  });

  it('should filter out discounts with valid_to in the past', () => {
    const past = new Date('2020-01-01').toISOString();
    const discounts = [createDiscount({ valid_to: past })];
    const result = getActiveDiscounts(discounts);
    expect(result).toHaveLength(0);
  });

  it('should include discounts within valid date range', () => {
    const past = new Date('2020-01-01').toISOString();
    const future = new Date('2099-01-01').toISOString();
    const discounts = [createDiscount({ valid_from: past, valid_to: future })];
    const result = getActiveDiscounts(discounts);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no discounts provided', () => {
    expect(getActiveDiscounts([])).toHaveLength(0);
  });
});

describe('calculateDiscountAmount', () => {
  it('should calculate percent discount correctly', () => {
    const discount = createDiscount({
      discount_type: 'percent',
      discount_value: 20,
    });
    expect(calculateDiscountAmount(discount, 1000)).toBe(200);
  });

  it('should calculate fixed amount discount correctly', () => {
    const discount = createDiscount({
      discount_type: 'amount',
      discount_value: 150,
    });
    expect(calculateDiscountAmount(discount, 1000)).toBe(150);
  });

  it('should round percent discount to integer', () => {
    const discount = createDiscount({
      discount_type: 'percent',
      discount_value: 33,
    });
    expect(calculateDiscountAmount(discount, 1000)).toBe(330);
  });

  it('should throw on unknown discount type', () => {
    const discount = createDiscount({ discount_type: 'unknown' });
    expect(() => calculateDiscountAmount(discount, 1000)).toThrow(
      'Incorrect discount type'
    );
  });
});

describe('calculateFinalPrice', () => {
  it('should subtract discount from original price', () => {
    expect(calculateFinalPrice(1000, 200)).toBe(800);
  });

  it('should not go below zero', () => {
    expect(calculateFinalPrice(100, 500)).toBe(0);
  });

  it('should return original price when discount is 0', () => {
    expect(calculateFinalPrice(1000, 0)).toBe(1000);
  });
});

describe('selectBestDiscount', () => {
  it('should select discount with highest priority', () => {
    const discounts = [
      createDiscount({ id: '1', priority: 1, discount_value: 50 }),
      createDiscount({ id: '2', priority: 2, discount_value: 10 }),
    ];
    const best = selectBestDiscount(discounts, 1000);
    expect(best.id).toBe('2');
  });

  it('should select largest amount when priorities are equal', () => {
    const discounts = [
      createDiscount({
        id: '1',
        priority: 1,
        discount_type: 'percent',
        discount_value: 10,
      }),
      createDiscount({
        id: '2',
        priority: 1,
        discount_type: 'percent',
        discount_value: 30,
      }),
    ];
    const best = selectBestDiscount(discounts, 1000);
    expect(best.id).toBe('2');
  });

  it('should compare amount and percent by actual value', () => {
    const discounts = [
      createDiscount({
        id: '1',
        priority: 1,
        discount_type: 'amount',
        discount_value: 200,
      }),
      createDiscount({
        id: '2',
        priority: 1,
        discount_type: 'percent',
        discount_value: 10,
      }),
    ];
    const best = selectBestDiscount(discounts, 1000);
    expect(best.id).toBe('1');
  });
});

describe('applyDiscountsToProduct', () => {
  it('should return original price when no discounts', () => {
    const result = applyDiscountsToProduct([], 1000);
    expect(result.finalPrice).toBe(1000);
    expect(result.discountAmount).toBe(0);
    expect(result.appliedDiscount).toBeUndefined();
  });

  it('should return original price when all discounts are inactive', () => {
    const discounts = [createDiscount({ is_active: false })];
    const result = applyDiscountsToProduct(discounts, 1000);
    expect(result.finalPrice).toBe(1000);
    expect(result.discountAmount).toBe(0);
  });

  it('should apply best active discount and return full result', () => {
    const discounts = [
      createDiscount({
        id: '1',
        discount_type: 'percent',
        discount_value: 20,
        is_active: true,
      }),
    ];
    const result = applyDiscountsToProduct(discounts, 1000);
    expect(result.finalPrice).toBe(800);
    expect(result.discountAmount).toBe(200);
    expect(result.appliedDiscount).toBeDefined();
    expect(result.appliedDiscount?.id).toBe('1');
  });

  it('should include validUntil in appliedDiscount when valid_to exists', () => {
    const validTo = '2099-06-15T00:00:00.000Z';
    const discounts = [createDiscount({ valid_to: validTo, is_active: true })];
    const result = applyDiscountsToProduct(discounts, 1000);
    expect(result.appliedDiscount?.validUntil).toEqual(new Date(validTo));
  });
});
