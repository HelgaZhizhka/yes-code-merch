import { useSuspenseQuery } from '@tanstack/react-query';

import { getRootCategories } from '@shared/api/categories';
import type { Category } from '@shared/interfaces';

const queryKey = {
  rootCategories: ['rootCategories'],
};

export const useRootCategories = (): {
  data: Category[] | null;
} => {
  const { data } = useSuspenseQuery<Category[] | null>({
    queryKey: queryKey.rootCategories,
    queryFn: getRootCategories,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  return { data };
};
