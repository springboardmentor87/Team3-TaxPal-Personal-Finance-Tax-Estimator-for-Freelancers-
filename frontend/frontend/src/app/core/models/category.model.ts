export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  userId: number;
  name: string;
  type: CategoryType;
}