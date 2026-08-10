import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Category, Transaction, TransactionType } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface SpendingByCategoryProps {
  transactions: Transaction[];
  categories: Category[];
  type: TransactionType;
  currencyCode: string;
}

export const SpendingByCategoryChart: React.FC<SpendingByCategoryProps> = ({
  transactions,
  categories,
  type,
  currencyCode,
}) => {
  const filteredTx = transactions.filter((t) => t.type === type);

  // Group amounts by category
  const categoryTotals: { [catId: string]: number } = {};
  filteredTx.forEach((t) => {
    categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount;
  });

  const chartData = Object.keys(categoryTotals)
    .map((catId) => {
      const cat = categories.find((c) => c.id === catId);
      return {
        name: cat ? cat.name : 'Uncategorized',
        value: categoryTotals[catId],
        color: cat ? cat.colorHex : '#94A3B8',
      };
    })
    .sort((a, b) => b.value - a.value);

  const totalSum = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <p className="text-sm font-medium text-slate-500">No {type.toLowerCase()} data available</p>
        <p className="text-xs text-slate-400 mt-1">Add transactions to see category breakdown</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {type === 'EXPENSE' ? 'Expenses by Category' : 'Income Sources'}
          </h3>
          <p className="text-xs text-slate-500">Total: {formatCurrency(totalSum, currencyCode)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number) => [formatCurrency(val, currencyCode), 'Amount']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend List */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {chartData.map((item, idx) => {
            const percentage = totalSum > 0 ? Math.round((item.value / totalSum) * 100) : 0;
            return (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white shrink-0">
                    <span>{formatCurrency(item.value, currencyCode)}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({percentage}%)</span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface CashFlowBarChartProps {
  transactions: Transaction[];
  currencyCode: string;
}

export const CashFlowBarChart: React.FC<CashFlowBarChartProps> = ({
  transactions,
  currencyCode,
}) => {
  // Group transactions by date (or day/week)
  const dateGroups: { [date: string]: { income: number; expense: number } } = {};

  // Sort transactions by date ascending
  const sortedTx = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  sortedTx.forEach((t) => {
    if (!dateGroups[t.date]) {
      dateGroups[t.date] = { income: 0, expense: 0 };
    }
    if (t.type === 'INCOME') {
      dateGroups[t.date].income += t.amount;
    } else {
      dateGroups[t.date].expense += t.amount;
    }
  });

  const chartData = Object.keys(dateGroups).map((dateStr) => ({
    date: formatDate(dateStr),
    Income: dateGroups[dateStr].income,
    Expense: dateGroups[dateStr].expense,
  }));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cash Flow Breakdown</h3>
          <p className="text-xs text-slate-500">Income vs Expenses over time</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
            <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
            <Tooltip
              formatter={(val: number) => [formatCurrency(val, currencyCode)]}
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
