export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  country: string;
  incomeBracket?: 'low' | 'middle' | 'high';
}