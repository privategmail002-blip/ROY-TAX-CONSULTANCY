import React, { useState } from 'react';
import { Category, Transaction } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { Plus, Edit2, Trash2, FolderTree, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface CategoriesViewProps {
  categories: Category[];
  transactions: Transaction[];
  currencyCode: string;
  onOpenAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  transactions,
  currencyCode,
  onOpenAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  // Calculate usage stats per category
  const getCategoryStats = (catId: string) => {
    const catTx = transactions.filter((t) => t.categoryId === catId);
    const count = catTx.length;
    const total = catTx.reduce((sum, t) => sum + t.amount, 0);
    return { count, total };
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Custom Categories</h2>
          <p className="text-xs text-slate-500">
            Create, edit, and organize income and expense categories
          </p>
        </div>

        <button
          onClick={onOpenAddCategory}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Income / Expense Tabs */}
      <div className="flex items-center gap-1 rounded-xl bg-slate-200/60 p-1 dark:bg-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('EXPENSE')}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'EXPENSE'
              ? 'bg-white text-rose-600 shadow-xs dark:bg-slate-900 dark:text-rose-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Expense Categories ({categories.filter((c) => c.type === 'EXPENSE').length})
        </button>
        <button
          onClick={() => setActiveTab('INCOME')}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'INCOME'
              ? 'bg-white text-emerald-600 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Income Categories ({categories.filter((c) => c.type === 'INCOME').length})
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => {
          const stats = getCategoryStats(category.id);

          return (
            <div
              key={category.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-xs"
                    style={{ backgroundColor: category.colorHex }}
                  >
                    <CategoryIcon iconName={category.iconName} className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {category.isDefault ? 'Default System Category' : 'Custom Category'}
                    </p>
                  </div>
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditCategory(category)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                    title="Edit Category"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {!category.isDefault && (
                    <button
                      onClick={() => onDeleteCategory(category.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                      title="Delete Category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Flow
                  </p>
                  <p
                    className={`text-sm font-extrabold ${
                      category.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {formatCurrency(stats.total, currencyCode)}
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {stats.count} {stats.count === 1 ? 'record' : 'records'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
