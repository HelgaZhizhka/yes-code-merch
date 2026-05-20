import { describe, expect, it } from 'vitest';

import type { CategoryTree } from '@shared/api';

import { pickTopDiscountedRoot } from './pick-top-discounted-root';

import type { CatalogProduct } from '../model/types';

// --- helpers ---

const makeRoot = (
  id: string,
  name: string,
  slug: string,
  orderHint: string,
  children: CategoryTree[] = []
): CategoryTree => ({
  id,
  name,
  slug,
  parentId: null,
  orderHint,
  depth: 0,
  rootId: id,
  rootName: name,
  rootSlug: slug,
  children,
});

const makeChild = (id: string, parentRoot: CategoryTree): CategoryTree => ({
  id,
  name: `Child ${id}`,
  slug: `child-${id}`,
  parentId: parentRoot.id,
  orderHint: '001',
  depth: 1,
  rootId: parentRoot.rootId,
  rootName: parentRoot.rootName,
  rootSlug: parentRoot.rootSlug,
  children: [],
});

const makeProduct = (
  productId: string,
  categoryIds: string[]
): CatalogProduct => ({
  productId,
  name: 'Test Product',
  slug: productId,
  description: null,
  masterVariantId: 'v1',
  sku: productId,
  stock: 10,
  originalPrice: 100,
  finalPrice: 80,
  currency: 'USD',
  hasDiscount: true,
  categoryIds,
  images: null,
});

// --- roots fixture ---
const clothes = makeRoot('r-clothes', 'Clothes', 'clothes', '001');
const drinkware = makeRoot('r-drinkware', 'Drinkware', 'drinkware', '002');
const tshirts = makeChild('c-tshirts', clothes);
const mugs = makeChild('c-mugs', drinkware);

// --- tests ---

describe('pickTopDiscountedRoot', () => {
  it('returns null when products array is empty', () => {
    expect(pickTopDiscountedRoot([], [clothes, drinkware])).toBeNull();
  });

  it('returns null when tree is empty', () => {
    const p = makeProduct('p1', ['c-tshirts']);
    expect(pickTopDiscountedRoot([p], [])).toBeNull();
  });

  it('returns the only root when a single root has discounted products', () => {
    const p1 = makeProduct('p1', ['c-tshirts']);
    const p2 = makeProduct('p2', ['c-tshirts']);
    const tree = [{ ...clothes, children: [tshirts] }];

    const result = pickTopDiscountedRoot([p1, p2], tree);

    expect(result).not.toBeNull();
    expect(result?.root.id).toBe('r-clothes');
    expect(result?.root.name).toBe('Clothes');
    expect(result?.root.slug).toBe('clothes');
    expect(result?.products).toHaveLength(2);
  });

  it('returns the root with the most discounted products', () => {
    const tree = [
      { ...clothes, children: [tshirts] },
      { ...drinkware, children: [mugs] },
    ];
    const products = [
      makeProduct('p1', ['c-tshirts']),
      makeProduct('p2', ['c-tshirts']),
      makeProduct('p3', ['c-tshirts']),
      makeProduct('p4', ['c-mugs']),
    ];

    const result = pickTopDiscountedRoot(products, tree);

    expect(result?.root.id).toBe('r-clothes');
    expect(result?.products).toHaveLength(3);
  });

  it('breaks ties by orderHint ascending', () => {
    const tree = [
      { ...clothes, children: [tshirts] }, // orderHint '001'
      { ...drinkware, children: [mugs] }, // orderHint '002'
    ];
    const products = [
      makeProduct('p1', ['c-tshirts']),
      makeProduct('p2', ['c-mugs']),
    ];

    const result = pickTopDiscountedRoot(products, tree);

    expect(result?.root.id).toBe('r-clothes'); // '001' < '002'
  });

  it('counts a product in both roots when it belongs to both', () => {
    const tree = [
      { ...clothes, children: [tshirts] },
      { ...drinkware, children: [mugs] },
    ];
    // p1 belongs to both roots
    const p1 = makeProduct('p1', ['c-tshirts', 'c-mugs']);
    // p2 belongs only to clothes — makes clothes the winner
    const p2 = makeProduct('p2', ['c-tshirts']);

    const result = pickTopDiscountedRoot([p1, p2], tree);

    expect(result?.root.id).toBe('r-clothes'); // clothes: 2, drinkware: 1
    // p1 should appear in winner's products (it belongs to clothes too)
    expect(result?.products.map((p) => p.productId)).toContain('p1');
  });

  it('slices products to limit', () => {
    const tree = [{ ...clothes, children: [tshirts] }];
    const products = Array.from({ length: 10 }, (_, i) =>
      makeProduct(`p${i}`, ['c-tshirts'])
    );

    const result = pickTopDiscountedRoot(products, tree, 6);

    expect(result?.products).toHaveLength(6);
  });

  it('returns fewer than limit when not enough products available', () => {
    const tree = [{ ...clothes, children: [tshirts] }];
    const products = [
      makeProduct('p1', ['c-tshirts']),
      makeProduct('p2', ['c-tshirts']),
    ];

    const result = pickTopDiscountedRoot(products, tree, 6);

    expect(result?.products).toHaveLength(2);
  });

  it('ignores products with empty categoryIds', () => {
    const tree = [{ ...clothes, children: [tshirts] }];
    const products = [
      makeProduct('p1', []), // no categories
      makeProduct('p2', ['c-tshirts']),
    ];

    const result = pickTopDiscountedRoot(products, tree);

    expect(result?.root.id).toBe('r-clothes');
    expect(result?.products.map((p) => p.productId)).not.toContain('p1');
  });

  it('resolves leaf categoryId to correct root', () => {
    // product's categoryId is a leaf (c-tshirts), not the root directly
    const tree = [{ ...clothes, children: [tshirts] }];
    const p = makeProduct('p1', ['c-tshirts']);

    const result = pickTopDiscountedRoot([p], tree);

    expect(result?.root.id).toBe('r-clothes');
    expect(result?.root.slug).toBe('clothes');
  });
});
