export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  iconName: string;
  colorHex: string;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string; // YYYY-MM-DD format
  note?: string;
  paymentMethod?: string;
}

export type TimeRange = 'this-month' | 'last-30-days' | 'this-year' | 'all-time';

export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export interface FilterOptions {
  type: 'ALL' | TransactionType;
  categoryId: string;
  search: string;
  startDate: string;
  endDate: string;
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}
