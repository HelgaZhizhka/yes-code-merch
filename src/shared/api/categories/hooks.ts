import { useEffect, useState } from 'react';

import { getRootCategories, type Category } from '@shared/api/categories';

export const useRootCategories = () => {
  // Tanstack Query hook for categories

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async (): Promise<void> => {
      try {
        const data = await getRootCategories();
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    loadCategories();
  }, []);

  return categories;
};
