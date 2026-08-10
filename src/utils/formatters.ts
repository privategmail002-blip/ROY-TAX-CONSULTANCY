import { Currency } from '../types';

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar ($)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar ($)' },
];

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  const currency = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  const isWhole = amount % 1 === 0;
  
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: isWhole ? 2 : 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  return `${currency.symbol}${formatted}`;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatRelativeDate = (dateString: string): string => {
  if (!dateString) return '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(dateString + 'T00:00:00');
  target.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - target.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays === -1) return 'Tomorrow';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
  
  return formatDate(dateString);
};

export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const CATEGORY_ICON_OPTIONS = [
  { name: 'Utensils', label: 'Food & Dining' },
  { name: 'ShoppingBag', label: 'Shopping' },
  { name: 'Home', label: 'Housing / Rent' },
  { name: 'Car', label: 'Transport' },
  { name: 'Zap', label: 'Utilities' },
  { name: 'Film', label: 'Entertainment' },
  { name: 'HeartPulse', label: 'Health' },
  { name: 'Briefcase', label: 'Salary / Work' },
  { name: 'TrendingUp', label: 'Investments' },
  { name: 'Laptop', label: 'Freelance' },
  { name: 'Coffee', label: 'Café & Snacks' },
  { name: 'GraduationCap', label: 'Education' },
  { name: 'Plane', label: 'Travel' },
  { name: 'Gift', label: 'Gifts & Rewards' },
  { name: 'Dumbbell', label: 'Fitness' },
  { name: 'Smartphone', label: 'Subcriptions' },
  { name: 'Tag', label: 'Other' },
];

export const CATEGORY_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#64748B', // Slate
];
