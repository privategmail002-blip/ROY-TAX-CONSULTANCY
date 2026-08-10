import React, { useState } from 'react';
import { Category, FilterOptions, Transaction, TransactionType } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, formatDate, formatRelativeDate } from '../utils/formatters';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  ArrowUpDown,
  Download,
  Calendar,
  X,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';

interface TransactionsViewProps {
  transactions: Transaction[];
  categories: Category[];
  currencyCode: string;
  onOpenAddTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onExportCSV: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  categories,
  currencyCode,
  onOpenAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onExportCSV,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'ALL',
    categoryId: 'ALL',
    search: '',
    startDate: '',
    endDate: '',
    sortBy: 'date-desc',
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Apply filters and sorting
  const filteredTransactions = transactions
    .filter((t) => {
      // Type filter
      if (filters.type !== 'ALL' && t.type !== filters.type) return false;

      // Category filter
      if (filters.categoryId !== 'ALL' && t.categoryId !== filters.categoryId) return false;

      // Search term filter
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const cat = categories.find((c) => c.id === t.categoryId);
        const catName = cat ? cat.name.toLowerCase() : '';
        const note = (t.note || '').toLowerCase();
        const payment = (t.paymentMethod || '').toLowerCase();
        const amountStr = t.amount.toString();

        if (
          !catName.includes(query) &&
          !note.includes(query) &&
          !payment.includes(query) &&
          !amountStr.includes(query)
        ) {
          return false;
        }
      }

      // Date range filter
      if (filters.startDate && t.date < filters.startDate) return false;
      if (filters.endDate && t.date > filters.endDate) return false;

      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'date-desc') return b.date.localeCompare(a.date);
      if (filters.sortBy === 'date-asc') return a.date.localeCompare(b.date);
      if (filters.sortBy === 'amount-desc') return b.amount - a.amount;
      if (filters.sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  // Calculate filtered totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const resetFilters = () => {
    setFilters({
      type: 'ALL',
      categoryId: 'ALL',
      search: '',
      startDate: '',
      endDate: '',
      sortBy: 'date-desc',
    });
  };

  const hasActiveFilters =
    filters.type !== 'ALL' ||
    filters.categoryId !== 'ALL' ||
    filters.search !== '' ||
    filters.startDate !== '' ||
    filters.endDate !== '';

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Transaction Log</h2>
          <p className="text-xs text-slate-500">View, search, filter, and export financial records</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddTransaction}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Filtered Overview Bar */}
      <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Filtered Income
          </p>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(totalIncome, currencyCode)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Filtered Expense
          </p>
          <p className="text-base font-bold text-rose-600 dark:text-rose-400">
            -{formatCurrency(totalExpense, currencyCode)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Net Difference
          </p>
          <p
            className={`text-base font-bold ${
              netBalance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600'
            }`}
          >
            {formatCurrency(netBalance, currencyCode)}
          </p>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by category, note, amount or payment method..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Type Filter Segmented Control */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 w-full sm:w-auto shrink-0">
            {(['ALL', 'EXPENSE', 'INCOME'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilters({ ...filters, type: t })}
                className={`flex-1 sm:flex-none rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  filters.type === t
                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {t === 'ALL' ? 'All' : t === 'EXPENSE' ? 'Expenses' : 'Incomes'}
              </button>
            ))}
          </div>

          {/* More Filters Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
              hasActiveFilters
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 shrink-0" />
            )}
          </button>
        </div>

        {/* Expandable Advanced Filter Drawer */}
        {isFilterOpen && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4 dark:border-slate-800 dark:bg-slate-900/50 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value as FilterOptions['sortBy'] })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc">Lowest Amount</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex justify-end">
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No matching transactions found
            </p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filters</p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-3 rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTransactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              const isIncome = tx.type === 'INCOME';

              return (
                <div
                  key={tx.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-white shrink-0 mt-0.5 sm:mt-0"
                      style={{ backgroundColor: cat?.colorHex || '#94A3B8' }}
                    >
                      <CategoryIcon iconName={cat?.iconName || 'Tag'} className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {cat ? cat.name : 'Uncategorized'}
                        </span>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isIncome
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                              : 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                          }`}
                        >
                          {tx.type}
                        </span>

                        {tx.paymentMethod && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            {tx.paymentMethod}
                          </span>
                        )}
                      </div>

                      {tx.note && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                          {tx.note}
                        </p>
                      )}

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {formatDate(tx.date)} ({formatRelativeDate(tx.date)})
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Amount & Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 border-slate-100 pt-2 sm:pt-0 dark:border-slate-800">
                    <span
                      className={`text-base font-extrabold ${
                        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currencyCode)}
                    </span>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                        title="Edit Record"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
