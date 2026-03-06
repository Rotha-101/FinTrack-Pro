import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency, generateId } from '../lib/utils';
import { Plus, Trash2, Landmark } from 'lucide-react';

export function AccountsTab() {
  const { accounts, addAccount, deleteAccount, profile } = useStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<'cash' | 'bank' | 'credit'>('bank');
  const [balance, setBalance] = useState('');

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!balance || isNaN(Number(balance)) || !name) return;
    
    addAccount({
      id: generateId(),
      name,
      type,
      balance: Number(balance)
    });
    setName('');
    setBalance('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg"><Landmark className="w-5 h-5" /></div>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Financial Accounts</h3>
        </div>

        <form onSubmit={handleAddAccount} className="flex flex-col md:flex-row gap-3 mb-8">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Account Name"
            className="flex-1 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-colors"
            required
          />
          <select
            value={type}
            onChange={e => setType(e.target.value as 'cash' | 'bank' | 'credit')}
            className="w-full md:w-32 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-colors"
          >
            <option value="bank">Bank</option>
            <option value="cash">Cash</option>
            <option value="credit">Credit</option>
          </select>
          <input
            type="number"
            value={balance}
            onChange={e => setBalance(e.target.value)}
            placeholder="Balance"
            className="w-full md:w-32 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-colors"
            required
          />
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        <div className="space-y-3">
          {accounts.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-slate-400 text-center py-4">No accounts added.</p>
          ) : (
            accounts.map(acc => (
              <div key={acc.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-slate-800/50 rounded-lg border border-zinc-100 dark:border-slate-700/50 group">
                <div>
                  <span className="font-medium text-zinc-900 dark:text-white block">{acc.name}</span>
                  <span className="text-xs text-zinc-500 dark:text-slate-400 uppercase">{acc.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-bold ${acc.balance < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {formatCurrency(acc.balance, profile?.currency)}
                  </span>
                  <button onClick={() => deleteAccount(acc.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
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
