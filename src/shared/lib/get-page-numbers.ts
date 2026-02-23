type PageItem = number | 'dots';

interface GetPageNumbersParams {
  totalCount: number;
  currentPage: number;
  siblingCount?: number;
}

const PAGINATION_ITEMS = 3;

const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const getPageNumbers = ({
  totalCount,
  siblingCount = 1,
  currentPage,
}: GetPageNumbersParams): PageItem[] => {
  const totalPageNumbers = siblingCount * 2 + PAGINATION_ITEMS;

  if (totalPageNumbers >= totalCount) {
    return range(1, totalCount);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalCount);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalCount;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    return [...range(1, totalPageNumbers), 'dots', totalCount];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    return [
      firstPageIndex,
      'dots',
      ...range(totalCount - totalPageNumbers + 1, totalCount),
    ];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [firstPageIndex, 'dots', ...middleRange, 'dots', lastPageIndex];
  }

  return [];
};
