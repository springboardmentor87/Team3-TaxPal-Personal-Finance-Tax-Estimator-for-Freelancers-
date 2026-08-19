export interface Budget {
  id: number;
  userId?: number;
  category: string;
  limit: number;
  month: string;
}