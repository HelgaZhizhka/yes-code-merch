import { useEffect, useState } from 'react';

import { getRootCategories, type Category } from '@shared/api/categories';

export const useRootCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async (): Promise<void> => {
      try {
        const data = await getRootCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    loadCategories();
  }, []);

  return categories;
};
