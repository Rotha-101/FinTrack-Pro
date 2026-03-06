import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency, generateId } from '../lib/utils';
import { Plus, Trash2, Wallet } from 'lucide-react';

export function BudgetsTab() {
  const { budgets, addBudget, deleteBudget, profile, categories } = useStore();
  const [category, setCategory] = useState(categories[0] || '');
  const [amount, setAmount] = useState('');

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    addBudget({
      id: generateId(),
      category,
      amount: Number(amount)
    });
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg"><Wallet className="w-5 h-5" /></div>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Monthly Budgets</h3>
        </div>

        <form onSubmit={handleAddBudget} className="flex gap-3 mb-8">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="flex-1 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-32 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
            required
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        <div className="space-y-3">
          {budgets.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-slate-400 text-center py-4">No budgets set.</p>
          ) : (
            budgets.map(budget => (
              <div key={budget.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-slate-800/50 rounded-lg border border-zinc-100 dark:border-slate-700/50 group">
                <span className="font-medium text-zinc-900 dark:text-white">{budget.category}</span>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-zinc-900 dark:text-white">{formatCurrency(budget.amount, profile?.currency)}</span>
                  <button onClick={() => deleteBudget(budget.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
