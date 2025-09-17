import { useSuspenseQuery } from '@tanstack/react-query';

import { getRootCategories } from '@shared/api/categories';
import type { Category } from '@shared/interfaces';

const queryKey = {
  rootCategories: ['rootCategories'],
};

export const useRootCategories = (): {
  data: Category[];
} => {
  const { data } = useSuspenseQuery<Category[]>({
    queryKey: queryKey.rootCategories,
    queryFn: getRootCategories,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
  });
  return { data };
};
