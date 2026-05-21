import type { CategoryTree } from '@shared/api';

import { DISCOUNTED_LIMIT } from './constants';

import type { CatalogProduct } from '../model/types';

export interface PickResult {
  root: { id: string; name: string; slug: string };
  products: CatalogProduct[];
}

interface RootEntry {
  rootId: string;
  rootName: string;
  rootSlug: string;
  rootOrderHint: string;
}

const buildRootMap = (tree: CategoryTree[]): Map<string, RootEntry> => {
  const map = new Map<string, RootEntry>();

  const walk = (nodes: CategoryTree[], rootOrderHint: string): void => {
    for (const node of nodes) {
      map.set(node.id, {
        rootId: node.rootId,
        rootName: node.rootName,
        rootSlug: node.rootSlug,
        rootOrderHint,
      });
      walk(node.children, rootOrderHint);
    }
  };

  for (const root of tree) {
    walk([root], root.orderHint);
  }

  return map;
};

export const pickTopDiscountedRoot = (
  products: CatalogProduct[],
  tree: CategoryTree[],
  limit = DISCOUNTED_LIMIT
): PickResult | null => {
  if (products.length === 0 || tree.length === 0) return null;

  const rootMap = buildRootMap(tree);
  const countByRootId = new Map<string, number>();
  const metaByRootId = new Map<
    string,
    { name: string; slug: string; orderHint: string }
  >();

  for (const product of products) {
    const visitedRoots = new Set<string>();

    for (const categoryId of product.categoryIds) {
      const entry = rootMap.get(categoryId);
      if (!entry || visitedRoots.has(entry.rootId)) continue;

      visitedRoots.add(entry.rootId);
      countByRootId.set(
        entry.rootId,
        (countByRootId.get(entry.rootId) ?? 0) + 1
      );

      if (!metaByRootId.has(entry.rootId)) {
        metaByRootId.set(entry.rootId, {
          name: entry.rootName,
          slug: entry.rootSlug,
          orderHint: entry.rootOrderHint,
        });
      }
    }
  }

  if (countByRootId.size === 0) return null;

  const [winningRootId] = [...countByRootId.entries()].sort(
    ([aId, aCount], [bId, bCount]) => {
      if (bCount !== aCount) return bCount - aCount;
      const aHint = metaByRootId.get(aId)?.orderHint ?? '';
      const bHint = metaByRootId.get(bId)?.orderHint ?? '';
      return aHint.localeCompare(bHint);
    }
  )[0];

  const winner = metaByRootId.get(winningRootId);
  if (!winner) return null;

  const winningProducts = products
    .filter((p) =>
      p.categoryIds.some((id) => rootMap.get(id)?.rootId === winningRootId)
    )
    .slice(0, limit);

  return {
    root: { id: winningRootId, name: winner.name, slug: winner.slug },
    products: winningProducts,
  };
};
