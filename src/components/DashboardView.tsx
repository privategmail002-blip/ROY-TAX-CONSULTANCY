import React, { useState } from 'react';
import { Category, TimeRange, Transaction } from '../types';
import { BalanceCard } from './BalanceCard';
import { SpendingByCategoryChart, CashFlowBarChart } from './Charts';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, formatRelativeDate } from '../utils/formatters';
import { ArrowUpRight, ArrowDownRight, Calendar, Plus, Trash2, Edit2, TrendingUp, Sparkles, Receipt } from 'lucide-react';

interface DashboardViewProps {
  transactions: Transaction[];
  categories: Category[];
  currencyCode: string;
  onOpenAddTransaction: (initialType?: 'INCOME' | 'EXPENSE') => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onViewAllTransactions: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  categories,
  currencyCode,
  onOpenAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onViewAllTransactions,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('this-month');

  // Filter transactions by time range
  const getFilteredByTime = () => {
    const now = new Date();
    return transactions.filter((t) => {
      const txDate = new Date(t.date + 'T00:00:00');
      if (timeRange === 'this-month') {
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      }
      if (timeRange === 'last-30-days') {
        const diffMs = now.getTime() - txDate.getTime();
        return diffMs <= 30 * 24 * 60 * 60 * 1000;
      }
      if (timeRange === 'this-year') {
        return txDate.getFullYear() === now.getFullYear();
      }
      return true; // all-time
    });
  };

  const filteredTransactions = getFilteredByTime();

  const income = filteredTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = filteredTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  // Recent 6 transactions
  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  // Top spending category
  const expenseByCategory: { [catId: string]: number } = {};
  filteredTransactions
    .filter((t) => t.type === 'EXPENSE')
    .forEach((t) => {
      expenseByCategory[t.categoryId] = (expenseByCategory[t.categoryId] || 0) + t.amount;
    });

  let topExpenseCat: Category | null = null;
  let topExpenseAmount = 0;
  Object.entries(expenseByCategory).forEach(([catId, amt]) => {
    if (amt > topExpenseAmount) {
      topExpenseAmount = amt;
      topExpenseCat = categories.find((c) => c.id === catId) || null;
    }
  });

  return (
    <div className="space-y-6">
      {/* Time Range Selector Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Financial Summary</h2>
          <p className="text-xs text-slate-500">Track income, expense, and category allocations</p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-slate-200/60 p-1 dark:bg-slate-800">
          {(
            [
              { id: 'this-month', label: 'This Month' },
              { id: 'last-30-days', label: '30 Days' },
              { id: 'this-year', label: 'This Year' },
              { id: 'all-time', label: 'All Time' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeRange(item.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                timeRange === item.id
                  ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Balance Card */}
      <BalanceCard
        income={income}
        expense={expense}
        currencyCode={currencyCode}
        onQuickAddIncome={() => onOpenAddTransaction('INCOME')}
        onQuickAddExpense={() => onOpenAddTransaction('EXPENSE')}
      />

      {/* Insights Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Top Expense Insight */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white shrink-0"
            style={{ backgroundColor: topExpenseCat?.colorHex || '#EF4444' }}
          >
            <CategoryIcon iconName={topExpenseCat?.iconName || 'Tag'} className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Top Expense Category
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {topExpenseCat ? topExpenseCat.name : 'None yet'}
            </p>
            <p className="text-xs text-rose-600 font-semibold">
              {topExpenseAmount > 0 ? formatCurrency(topExpenseAmount, currencyCode) : '$0.00'}
            </p>
          </div>
        </div>

        {/* Transaction Count */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 shrink-0">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Recorded Records
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {filteredTransactions.length} Transactions
            </p>
            <p className="text-xs text-slate-500">
              {filteredTransactions.filter((t) => t.type === 'INCOME').length} Incomes ·{' '}
              {filteredTransactions.filter((t) => t.type === 'EXPENSE').length} Expenses
            </p>
          </div>
        </div>

        {/* Average Daily Spending */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3 sm:col-span-2 lg:col-span-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Average Daily Outflow
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {formatCurrency(expense / 30, currencyCode)} / day
            </p>
            <p className="text-xs text-slate-500">Based on 30-day trailing baseline</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingByCategoryChart
          transactions={filteredTransactions}
          categories={categories}
          type="EXPENSE"
          currencyCode={currencyCode}
        />
        <CashFlowBarChart transactions={filteredTransactions} currencyCode={currencyCode} />
      </div>

      {/* Recent Transactions List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Latest activity log</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAddTransaction()}
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
            <button
              onClick={onViewAllTransactions}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400"
            >
              View All →
            </button>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No transactions found for this timeframe.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTransactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              const isIncome = tx.type === 'INCOME';

              return (
                <div
                  key={tx.id}
                  className="group flex items-center justify-between py-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white shrink-0"
                      style={{ backgroundColor: cat?.colorHex || '#94A3B8' }}
                    >
                      <CategoryIcon iconName={cat?.iconName || 'Tag'} className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {cat ? cat.name : 'Uncategorized'}
                        </p>
                        {tx.paymentMethod && (
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            {tx.paymentMethod}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {tx.note ? `${tx.note} · ` : ''}
                        {formatRelativeDate(tx.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm sm:text-base font-extrabold ${
                        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currencyCode)}
                    </span>

                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Delete"
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
