import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Calendar, FileText, CreditCard, Check } from 'lucide-react';
import { Category, Transaction, TransactionType } from '../types';
import { CategoryPicker } from './CategoryPicker';
import { getTodayString } from '../utils/formatters';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>, editId?: string) => void;
  categories: Category[];
  initialType?: TransactionType;
  editingTransaction?: Transaction | null;
  onOpenAddCategory?: () => void;
  currencyCode: string;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  initialType = 'EXPENSE',
  editingTransaction,
  onOpenAddCategory,
  currencyCode,
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayString());
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategoryId(editingTransaction.categoryId);
      setDate(editingTransaction.date);
      setNote(editingTransaction.note || '');
      setPaymentMethod(editingTransaction.paymentMethod || 'Credit Card');
    } else {
      setType(initialType);
      setAmount('');
      setDate(getTodayString());
      setNote('');
      setPaymentMethod('Credit Card');
      // Default to first matching category
      const firstCat = categories.find((c) => c.type === initialType);
      setCategoryId(firstCat ? firstCat.id : categories[0]?.id || '');
    }
    setError('');
  }, [editingTransaction, initialType, isOpen, categories]);

  // When type changes, ensure valid category selection
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const validCategory = categories.find((c) => c.type === newType);
    if (validCategory) {
      setCategoryId(validCategory.id);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    onSave(
      {
        amount: numAmount,
        type,
        categoryId,
        date,
        note: note.trim() || undefined,
        paymentMethod,
      },
      editingTransaction?.id
    );
    onClose();
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Income vs Expense Toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange('EXPENSE')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                type === 'EXPENSE'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <ArrowDownRight className="h-4 w-4" />
              <span>Expense</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('INCOME')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                type === 'INCOME'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <ArrowUpRight className="h-4 w-4" />
              <span>Income</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Amount ({currencyCode})
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-2xl font-bold text-slate-400">
                {type === 'EXPENSE' ? '-' : '+'}
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-2xl font-extrabold text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Category Picker */}
          <CategoryPicker
            categories={categories}
            typeFilter={type}
            selectedCategoryId={categoryId}
            onSelect={(cat) => setCategoryId(cat.id)}
            onAddNewCategory={onOpenAddCategory}
          />

          {/* Date & Payment Method Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Date
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Payment Method
              </label>
              <div className="relative flex items-center">
                <CreditCard className="absolute left-3 h-4 w-4 text-slate-400" />
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Note (Optional)
            </label>
            <div className="relative flex items-center">
              <FileText className="absolute left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Grocery shopping at Trader Joe's"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>{editingTransaction ? 'Update Transaction' : 'Save Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
