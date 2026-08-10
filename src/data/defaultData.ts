import { Category, Transaction } from '../types';
import { getTodayString } from '../utils/formatters';

export const DEFAULT_CATEGORIES: Category[] = [
  // Income Categories
  {
    id: 'cat-salary',
    name: 'Salary',
    type: 'INCOME',
    iconName: 'Briefcase',
    colorHex: '#10B981',
    isDefault: true,
  },
  {
    id: 'cat-freelance',
    name: 'Freelance & Side Projects',
    type: 'INCOME',
    iconName: 'Laptop',
    colorHex: '#06B6D4',
    isDefault: true,
  },
  {
    id: 'cat-investments',
    name: 'Investments & Dividends',
    type: 'INCOME',
    iconName: 'TrendingUp',
    colorHex: '#3B82F6',
    isDefault: true,
  },
  {
    id: 'cat-gifts-income',
    name: 'Gifts & Bonuses',
    type: 'INCOME',
    iconName: 'Gift',
    colorHex: '#8B5CF6',
    isDefault: true,
  },

  // Expense Categories
  {
    id: 'cat-food',
    name: 'Food & Dining',
    type: 'EXPENSE',
    iconName: 'Utensils',
    colorHex: '#F59E0B',
    isDefault: true,
  },
  {
    id: 'cat-housing',
    name: 'Housing & Rent',
    type: 'EXPENSE',
    iconName: 'Home',
    colorHex: '#EF4444',
    isDefault: true,
  },
  {
    id: 'cat-transport',
    name: 'Transport & Fuel',
    type: 'EXPENSE',
    iconName: 'Car',
    colorHex: '#3B82F6',
    isDefault: true,
  },
  {
    id: 'cat-shopping',
    name: 'Shopping & Apparel',
    type: 'EXPENSE',
    iconName: 'ShoppingBag',
    colorHex: '#EC4899',
    isDefault: true,
  },
  {
    id: 'cat-utilities',
    name: 'Utilities & Bills',
    type: 'EXPENSE',
    iconName: 'Zap',
    colorHex: '#8B5CF6',
    isDefault: true,
  },
  {
    id: 'cat-entertainment',
    name: 'Entertainment & Media',
    type: 'EXPENSE',
    iconName: 'Film',
    colorHex: '#6366F1',
    isDefault: true,
  },
  {
    id: 'cat-health',
    name: 'Health & Wellness',
    type: 'EXPENSE',
    iconName: 'HeartPulse',
    colorHex: '#10B981',
    isDefault: true,
  },
  {
    id: 'cat-coffee',
    name: 'Café & Coffee',
    type: 'EXPENSE',
    iconName: 'Coffee',
    colorHex: '#D97706',
    isDefault: true,
  },
];

const today = new Date();
const getDateOffset = (daysAgo: number): string => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    amount: 4250.00,
    type: 'INCOME',
    categoryId: 'cat-salary',
    date: getDateOffset(1),
    note: 'Monthly Salary Payment',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'tx-102',
    amount: 1450.00,
    type: 'EXPENSE',
    categoryId: 'cat-housing',
    date: getDateOffset(2),
    note: 'Apartment Rent - Current Month',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'tx-103',
    amount: 85.40,
    type: 'EXPENSE',
    categoryId: 'cat-food',
    date: getDateOffset(0),
    note: 'Weekly Organic Grocery Market',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'tx-104',
    amount: 650.00,
    type: 'INCOME',
    categoryId: 'cat-freelance',
    date: getDateOffset(4),
    note: 'UI Design Client Milestone',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'tx-105',
    amount: 45.00,
    type: 'EXPENSE',
    categoryId: 'cat-transport',
    date: getDateOffset(3),
    note: 'Gas Station Refill',
    paymentMethod: 'Debit Card',
  },
  {
    id: 'tx-106',
    amount: 120.00,
    type: 'EXPENSE',
    categoryId: 'cat-utilities',
    date: getDateOffset(5),
    note: 'Electricity & High-speed Fiber Internet',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'tx-107',
    amount: 14.99,
    type: 'EXPENSE',
    categoryId: 'cat-entertainment',
    date: getDateOffset(6),
    note: 'Streaming Service Subscription',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'tx-108',
    amount: 6.50,
    type: 'EXPENSE',
    categoryId: 'cat-coffee',
    date: getDateOffset(0),
    note: 'Morning Cold Brew Coffee',
    paymentMethod: 'Cash',
  },
  {
    id: 'tx-109',
    amount: 135.20,
    type: 'EXPENSE',
    categoryId: 'cat-shopping',
    date: getDateOffset(7),
    note: 'New Running Shoes',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'tx-110',
    amount: 210.00,
    type: 'INCOME',
    categoryId: 'cat-investments',
    date: getDateOffset(10),
    note: 'Quarterly Stock Dividends',
    paymentMethod: 'Bank Transfer',
  },
];
