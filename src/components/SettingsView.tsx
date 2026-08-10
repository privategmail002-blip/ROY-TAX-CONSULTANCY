import React, { useRef } from 'react';
import { Currency } from '../types';
import { CURRENCIES } from '../utils/formatters';
import {
  Coins,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  HardDrive,
  FileSpreadsheet,
} from 'lucide-react';

interface SettingsViewProps {
  currencyCode: string;
  setCurrencyCode: (code: string) => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportJSON: (jsonString: string) => void;
  onResetData: () => void;
  transactionCount: number;
  categoryCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currencyCode,
  setCurrencyCode,
  onExportCSV,
  onExportJSON,
  onImportJSON,
  onResetData,
  transactionCount,
  categoryCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        try {
          onImportJSON(content);
          alert('Data imported successfully!');
        } catch (err) {
          alert('Invalid backup file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Settings & Preferences</h2>
        <p className="text-xs text-slate-500">Configure currency, manage backups, and app settings</p>
      </div>

      {/* Currency Selection */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Display Currency</h3>
            <p className="text-xs text-slate-500">Select your primary currency symbol for formatting</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CURRENCIES.map((curr) => {
            const isSelected = curr.code === currencyCode;
            return (
              <button
                key={curr.code}
                onClick={() => setCurrencyCode(curr.code)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-600 ring-2 ring-indigo-600/20 font-bold dark:bg-indigo-950 dark:text-indigo-400'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <span className="text-xl font-extrabold">{curr.symbol}</span>
                <span className="text-xs mt-1">{curr.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Export & Backup */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Backup & Export</h3>
            <p className="text-xs text-slate-500">
              Your financial records are saved offline in local storage ({transactionCount} records,{' '}
              {categoryCount} categories)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onExportCSV}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Download CSV Report</span>
          </button>

          <button
            onClick={onExportJSON}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <Download className="h-4 w-4 text-indigo-600" />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <Upload className="h-4 w-4 text-blue-600" />
            <span>Restore Backup (JSON)</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* Reset State */}
      <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-6 dark:border-rose-950/40 dark:bg-rose-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-rose-900 dark:text-rose-300">
              Reset Application Data
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
              Restore default sample categories and transactions. This will overwrite current entries.
            </p>
          </div>

          <button
            onClick={onResetData}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </div>

      {/* Security Banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
        <span>
          <strong>100% Private & Offline</strong>: All income, expense, and category data stays strictly
          in your browser's local storage. No external telemetry or cloud servers.
        </span>
      </div>
    </div>
  );
};
