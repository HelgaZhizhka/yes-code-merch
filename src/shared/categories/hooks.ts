import { useEffect, useState } from 'react';

import { getCategories, type Category } from '@shared/api/categories';

export const fetchCategories = async (): Promise<Category[]> => {
  return getCategories();
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async (): Promise<void> => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    loadCategories();
  }, []);

  return categories;
};
