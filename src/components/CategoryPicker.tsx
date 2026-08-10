import React from 'react';
import { Category, TransactionType } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { Plus } from 'lucide-react';

interface CategoryPickerProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelect: (category: Category) => void;
  typeFilter?: TransactionType;
  onAddNewCategory?: () => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  selectedCategoryId,
  onSelect,
  typeFilter,
  onAddNewCategory,
}) => {
  const filteredCategories = typeFilter
    ? categories.filter((c) => c.type === typeFilter)
    : categories;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Select Category
        </label>
        {onAddNewCategory && (
          <button
            type="button"
            onClick={onAddNewCategory}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Category</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1 pr-1.5 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
        {filteredCategories.map((category) => {
          const isSelected = category.id === selectedCategoryId;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category)}
              className={`group flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-600/20 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/40'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
              }`}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl mb-1.5 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: isSelected ? category.colorHex : `${category.colorHex}20`,
                  color: isSelected ? '#FFFFFF' : category.colorHex,
                }}
              >
                <CategoryIcon iconName={category.iconName} className="h-5 w-5" />
              </div>
              <span
                className={`text-xs font-medium line-clamp-1 w-full ${
                  isSelected
                    ? 'text-indigo-950 font-semibold dark:text-white'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {category.name}
              </span>
            </button>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="col-span-full py-8 text-center text-xs text-slate-500">
            No categories found for this type.
          </div>
        )}
      </div>
    </div>
  );
};
