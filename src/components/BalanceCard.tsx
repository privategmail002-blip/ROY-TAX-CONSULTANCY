import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface BalanceCardProps {
  income: number;
  expense: number;
  currencyCode: string;
  onQuickAddIncome?: () => void;
  onQuickAddExpense?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  income,
  expense,
  currencyCode,
  onQuickAddIncome,
  onQuickAddExpense,
}) => {
  const balance = income - expense;
  const isPositive = balance >= 0;
  const savingsRate = income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* Background Subtle Accent Glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Net Balance
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Real-time financial status</p>
            </div>
          </div>

          {/* Savings Rate Badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <PiggyBank className="h-3.5 w-3.5 text-indigo-500" />
            <span>{savingsRate}% Saved</span>
          </div>
        </div>

        {/* Balance Display */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <h2
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                isPositive ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatCurrency(balance, currencyCode)}
            </h2>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
            <span>Cashflow health score: {isPositive ? 'Positive' : 'Deficit'}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

        {/* Income vs Expense Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Income Box */}
          <div
            onClick={onQuickAddIncome}
            className={`group flex items-center justify-between rounded-xl border border-emerald-100/80 bg-emerald-50/40 p-3.5 transition-all hover:bg-emerald-50 hover:border-emerald-200 dark:border-emerald-950/50 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 ${
              onQuickAddIncome ? 'cursor-pointer' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400">
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:scale-110" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Income</p>
                <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(income, currencyCode)}
                </p>
              </div>
            </div>
          </div>

          {/* Expense Box */}
          <div
            onClick={onQuickAddExpense}
            className={`group flex items-center justify-between rounded-xl border border-rose-100/80 bg-rose-50/40 p-3.5 transition-all hover:bg-rose-50 hover:border-rose-200 dark:border-rose-950/50 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 ${
              onQuickAddExpense ? 'cursor-pointer' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400">
                <ArrowDownRight className="h-5 w-5 transition-transform group-hover:scale-110" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Expense</p>
                <p className="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400">
                  -{formatCurrency(expense, currencyCode)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
