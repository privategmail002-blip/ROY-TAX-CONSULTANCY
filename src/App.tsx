import React, { useState, useEffect } from 'react';
import { Category, Transaction, TransactionType } from './types';
import { DEFAULT_CATEGORIES, INITIAL_TRANSACTIONS } from './data/defaultData';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { CategoriesView } from './components/CategoriesView';
import { SettingsView } from './components/SettingsView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { Plus } from 'lucide-react';

const STORAGE_KEYS = {
  CATEGORIES: 'tracker_categories_v1',
  TRANSACTIONS: 'tracker_transactions_v1',
  CURRENCY: 'tracker_currency_v1',
};

export default function App() {
  // Categories State
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Currency State
  const [currencyCode, setCurrencyCode] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENCY) || 'USD';
    } catch {
      return 'USD';
    }
  });

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'categories' | 'settings'>(
    'dashboard'
  );

  // Modals
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [initialTxType, setInitialTxType] = useState<TransactionType>('EXPENSE');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currencyCode);
  }, [currencyCode]);

  // Handlers for Transactions
  const handleOpenAddTx = (type: TransactionType = 'EXPENSE') => {
    setEditingTx(null);
    setInitialTxType(type);
    setIsAddTxOpen(true);
  };

  const handleEditTx = (tx: Transaction) => {
    setEditingTx(tx);
    setIsAddTxOpen(true);
  };

  const handleSaveTx = (txData: Omit<Transaction, 'id'>, editId?: string) => {
    if (editId) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === editId ? { ...txData, id: editId } : t))
      );
    } else {
      const newTx: Transaction = {
        ...txData,
        id: `tx-${Date.now()}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  const handleDeleteTx = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Handlers for Categories
  const handleOpenAddCat = () => {
    setEditingCat(null);
    setIsAddCatOpen(true);
  };

  const handleEditCat = (cat: Category) => {
    setEditingCat(cat);
    setIsAddCatOpen(true);
  };

  const handleSaveCat = (catData: Omit<Category, 'id'>, editId?: string) => {
    if (editId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editId ? { ...catData, id: editId, isDefault: c.isDefault } : c))
      );
    } else {
      const newCat: Category = {
        ...catData,
        id: `cat-custom-${Date.now()}`,
        isDefault: false,
      };
      setCategories((prev) => [...prev, newCat]);
    }
  };

  const handleDeleteCat = (catId: string) => {
    const linkedTx = transactions.filter((t) => t.categoryId === catId);
    if (linkedTx.length > 0) {
      alert(
        `Cannot delete this category because it is used by ${linkedTx.length} transactions. Please reassign or delete those records first.`
      );
      return;
    }

    if (window.confirm('Are you sure you want to delete this custom category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== catId));
    }
  };

  // Data Export Handlers
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Category', 'Amount', 'Payment Method', 'Note'];
    const rows = transactions.map((t) => {
      const cat = categories.find((c) => c.id === t.categoryId)?.name || 'Uncategorized';
      return [
        t.id,
        t.date,
        t.type,
        `"${cat}"`,
        t.amount,
        `"${t.paymentMethod || ''}"`,
        `"${(t.note || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `income_expense_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const data = {
      categories,
      transactions,
      currencyCode,
      exportedAt: new Date().toISOString(),
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `financial_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJSON = (jsonString: string) => {
    const data = JSON.parse(jsonString);
    if (Array.isArray(data.categories) && Array.isArray(data.transactions)) {
      setCategories(data.categories);
      setTransactions(data.transactions);
      if (data.currencyCode) setCurrencyCode(data.currencyCode);
    } else {
      throw new Error('Invalid format');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data back to original default samples?')) {
      setCategories(DEFAULT_CATEGORIES);
      setTransactions(INITIAL_TRANSACTIONS);
      setCurrencyCode('USD');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddTransaction={() => handleOpenAddTx('EXPENSE')}
        currencyCode={currencyCode}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 mb-20 md:mb-12">
        {activeTab === 'dashboard' && (
          <DashboardView
            transactions={transactions}
            categories={categories}
            currencyCode={currencyCode}
            onOpenAddTransaction={handleOpenAddTx}
            onEditTransaction={handleEditTx}
            onDeleteTransaction={handleDeleteTx}
            onViewAllTransactions={() => setActiveTab('transactions')}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            categories={categories}
            currencyCode={currencyCode}
            onOpenAddTransaction={() => handleOpenAddTx('EXPENSE')}
            onEditTransaction={handleEditTx}
            onDeleteTransaction={handleDeleteTx}
            onExportCSV={handleExportCSV}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesView
            categories={categories}
            transactions={transactions}
            currencyCode={currencyCode}
            onOpenAddCategory={handleOpenAddCat}
            onEditCategory={handleEditCat}
            onDeleteCategory={handleDeleteCat}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            currencyCode={currencyCode}
            setCurrencyCode={setCurrencyCode}
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
            onImportJSON={handleImportJSON}
            onResetData={handleResetData}
            transactionCount={transactions.length}
            categoryCount={categories.length}
          />
        )}
      </main>

      {/* Floating Action Button (+) for Quick Add */}
      <button
        onClick={() => handleOpenAddTx('EXPENSE')}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all duration-150"
        title="Quick Add Transaction"
      >
        <Plus className="h-7 w-7" />
      </button>

      {/* Add / Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        onSave={handleSaveTx}
        categories={categories}
        initialType={initialTxType}
        editingTransaction={editingTx}
        onOpenAddCategory={() => {
          setIsAddTxOpen(false);
          handleOpenAddCat();
        }}
        currencyCode={currencyCode}
      />

      {/* Add / Edit Category Modal */}
      <AddCategoryModal
        isOpen={isAddCatOpen}
        onClose={() => setIsAddCatOpen(false)}
        onSave={handleSaveCat}
        editingCategory={editingCat}
      />
    </div>
  );
}
