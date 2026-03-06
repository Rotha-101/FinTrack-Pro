import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency } from '../lib/utils';
import { Download, FileSpreadsheet, FileJson, Calendar, Printer, FileBarChart } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export function ReportsTab() {
  const { transactions, profile, selectedYear } = useStore();
  const [exportType, setExportType] = useState<'yearly' | 'monthly' | 'daily'>('yearly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const yearTransactions = transactions.filter(t => t.date.startsWith(selectedYear.toString()));
  
  const getFilteredTransactions = () => {
    if (exportType === 'yearly') return yearTransactions;
    if (exportType === 'monthly') {
      const monthStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
      return yearTransactions.filter(t => t.date.startsWith(monthStr));
    }
    return yearTransactions; // Default to yearly for preview
  };

  const filteredTxs = getFilteredTransactions().sort((a, b) => b.date.localeCompare(a.date));

  const totalIncome = yearTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  
  const topCategory = Object.entries(
    yearTransactions.filter(t => t.type === 'expense').reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => (b[1] as number) - (a[1] as number))[0];

  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];
    const csvContent = [
      headers.join(','),
      ...filteredTxs.map(t => [
        t.date,
        t.type,
        t.category,
        t.amount,
        `"${t.note.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fintrack_export_${selectedYear}${exportType === 'monthly' ? `_${selectedMonth + 1}` : ''}.csv`;
    link.click();
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(filteredTxs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fintrack_export_${selectedYear}${exportType === 'monthly' ? `_${selectedMonth + 1}` : ''}.json`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between transition-colors">
          <div>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-white mb-2">Export Data</h2>
            <p className="text-sm text-zinc-500 dark:text-slate-400">Download your financial records for backup or external analysis.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <select 
              value={exportType} 
              onChange={e => setExportType(e.target.value as any)}
              className="bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white transition-colors"
            >
              <option value="yearly">Full Year ({selectedYear})</option>
              <option value="monthly">Specific Month</option>
            </select>

            {exportType === 'monthly' && (
              <select 
                value={selectedMonth} 
                onChange={e => setSelectedMonth(Number(e.target.value))}
                className="bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white transition-colors"
              >
                {Array.from({length: 12}).map((_, i) => (
                  <option key={i} value={i}>{new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}</option>
                ))}
              </select>
            )}

            <div className="flex gap-2">
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" /> CSV
              </button>
              <button 
                onClick={handleExportJSON}
                className="flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <FileJson className="w-4 h-4" /> JSON
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300 hover:bg-zinc-200 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-4 flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-emerald-500" />
            Executive Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500 dark:text-slate-400">Net Savings</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(netSavings, profile?.currency)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500 dark:text-slate-400">Savings Rate</span>
              <span className="font-bold text-zinc-900 dark:text-white">{savingsRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500 dark:text-slate-400">Total Income</span>
              <span className="font-medium text-zinc-900 dark:text-white">{formatCurrency(totalIncome, profile?.currency)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500 dark:text-slate-400">Total Expense</span>
              <span className="font-medium text-zinc-900 dark:text-white">{formatCurrency(totalExpense, profile?.currency)}</span>
            </div>
            {topCategory && (
              <div className="pt-4 border-t border-zinc-100 dark:border-slate-800">
                <div className="text-xs text-zinc-500 dark:text-slate-400 mb-1">Top Expense Category</div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-zinc-900 dark:text-white text-sm">{topCategory[0]}</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">{formatCurrency(topCategory[1] as number, profile?.currency)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px] transition-colors print:h-auto print:border-none print:shadow-none">
        <div className="p-6 border-b border-zinc-100 dark:border-slate-800 flex justify-between items-center bg-zinc-50/50 dark:bg-slate-800/50">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-zinc-400 dark:text-slate-500" />
            Data Preview ({filteredTxs.length} records)
          </h3>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 dark:bg-slate-800/80 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="py-3 px-6 text-xs font-semibold text-zinc-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-xs font-semibold text-zinc-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                <th className="py-3 px-6 text-xs font-semibold text-zinc-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                <th className="py-3 px-6 text-xs font-semibold text-zinc-500 dark:text-slate-400 uppercase tracking-wider">Note</th>
                <th className="py-3 px-6 text-xs font-semibold text-zinc-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-slate-800">
              {filteredTxs.map(t => (
                <tr key={t.id} className="hover:bg-zinc-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6 text-sm text-zinc-600 dark:text-slate-300 whitespace-nowrap">{format(parseISO(t.date), 'MMM d, yyyy')}</td>
                  <td className="py-3 px-6 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-sm text-zinc-900 dark:text-white font-medium">{t.category}</td>
                  <td className="py-3 px-6 text-sm text-zinc-500 dark:text-slate-400 truncate max-w-xs">{t.note || '-'}</td>
                  <td className={`py-3 px-6 text-sm font-bold text-right ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, profile?.currency)}
                  </td>
                </tr>
              ))}
              {filteredTxs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500 dark:text-slate-500 text-sm">
                    No transactions found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
