export interface Category {
  name: string;
}

export const getCategories = async (): Promise<Category[]> => {
  return [
    { name: 'Clothes' },
    { name: 'DrinkWare' },
    { name: 'Office' },
    { name: 'Bags' },
  ];
};
