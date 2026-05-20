export const makeSkeletonKeys = (
  prefix: string,
  count: number
): readonly string[] =>
  Array.from({ length: count }, (_, index) => `${prefix}-${index + 1}`);

export const NAV_SKELETON_KEYS = makeSkeletonKeys('nav', 4);
