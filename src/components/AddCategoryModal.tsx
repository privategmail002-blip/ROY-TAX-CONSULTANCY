import React, { useState, useEffect } from 'react';
import { X, Check, Palette } from 'lucide-react';
import { Category, TransactionType } from '../types';
import { CATEGORY_COLORS, CATEGORY_ICON_OPTIONS } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'>, editId?: string) => void;
  editingCategory?: Category | null;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [iconName, setIconName] = useState('Tag');
  const [colorHex, setColorHex] = useState(CATEGORY_COLORS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setType(editingCategory.type);
      setIconName(editingCategory.iconName);
      setColorHex(editingCategory.colorHex);
    } else {
      setName('');
      setType('EXPENSE');
      setIconName('Tag');
      setColorHex(CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)]);
    }
    setError('');
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    onSave(
      {
        name: name.trim(),
        type,
        iconName,
        colorHex,
      },
      editingCategory?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          {editingCategory ? 'Edit Category' : 'Create Custom Category'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Type */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                type === 'EXPENSE'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Expense Category
            </button>
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                type === 'INCOME'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Income Category
            </button>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Subscriptions, Gaming, Books"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Color Selector */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              <Palette className="h-3.5 w-3.5 text-indigo-500" />
              <span>Theme Color</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORY_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setColorHex(color)}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-transform ${
                    colorHex === color ? 'scale-110 ring-2 ring-indigo-600 ring-offset-2' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {colorHex === color && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Icon
            </label>
            <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
              {CATEGORY_ICON_OPTIONS.map((iconOpt) => {
                const isSelected = iconName === iconOpt.name;
                return (
                  <button
                    key={iconOpt.name}
                    type="button"
                    onClick={() => setIconName(iconOpt.name)}
                    title={iconOpt.label}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 ring-2 ring-indigo-600/20 dark:bg-indigo-950 dark:text-indigo-400'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <CategoryIcon iconName={iconOpt.name} className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Preview */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/80">
            <span className="text-xs font-medium text-slate-500">Preview</span>
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: colorHex }}
              >
                <CategoryIcon iconName={iconName} className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {name || 'Category Name'}
              </span>
            </div>
          </div>

          {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

          {/* Actions */}
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
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Check className="h-4 w-4" />
              <span>{editingCategory ? 'Update' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
