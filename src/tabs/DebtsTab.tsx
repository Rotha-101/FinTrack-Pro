import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency, generateId } from '../lib/utils';
import { Plus, Trash2, Receipt } from 'lucide-react';

export function DebtsTab() {
  const { debts, addDebt, deleteDebt, profile } = useStore();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<'owed_by_me' | 'owed_to_me'>('owed_by_me');

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || !totalAmount || isNaN(Number(totalAmount)) || !name || !dueDate) return;
    
    addDebt({
      id: generateId(),
      name,
      amount: Number(amount),
      totalAmount: Number(totalAmount),
      dueDate,
      type
    });
    setName('');
    setAmount('');
    setTotalAmount('');
    setDueDate('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg"><Receipt className="w-5 h-5" /></div>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Debts & Loans</h3>
        </div>

        <form onSubmit={handleAddDebt} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-8">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Debt Name (e.g., Car Loan)"
            className="col-span-1 md:col-span-2 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-rose-500 dark:text-white transition-colors"
            required
          />
          <select
            value={type}
            onChange={e => setType(e.target.value as 'owed_by_me' | 'owed_to_me')}
            className="bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-rose-500 dark:text-white transition-colors"
          >
            <option value="owed_by_me">I Owe</option>
            <option value="owed_to_me">Owed to Me</option>
          </select>
          <input
            type="number"
            value={totalAmount}
            onChange={e => setTotalAmount(e.target.value)}
            placeholder="Total Amount"
            className="bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-rose-500 dark:text-white transition-colors"
            required
          />
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount Paid"
            className="bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-rose-500 dark:text-white transition-colors"
            required
          />
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-rose-500 dark:text-white transition-colors"
            required
          />
          <button type="submit" className="col-span-1 md:col-span-6 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Debt
          </button>
        </form>

        <div className="space-y-3">
          {debts.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-slate-400 text-center py-4">No debts recorded.</p>
          ) : (
            debts.map(debt => {
              const progress = Math.min(100, Math.max(0, (debt.amount / debt.totalAmount) * 100));
              return (
                <div key={debt.id} className="p-4 bg-zinc-50 dark:bg-slate-800/50 rounded-lg border border-zinc-100 dark:border-slate-700/50 group">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-white block">{debt.name}</span>
                      <span className={`text-xs ${debt.type === 'owed_by_me' ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {debt.type === 'owed_by_me' ? 'I owe this' : 'Owed to me'} • Due: {debt.dueDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-bold text-zinc-900 dark:text-white block">{formatCurrency(debt.totalAmount - debt.amount, profile?.currency)} left</span>
                        <span className="text-xs text-zinc-500 dark:text-slate-400">{formatCurrency(debt.amount, profile?.currency)} paid of {formatCurrency(debt.totalAmount, profile?.currency)}</span>
                      </div>
                      <button onClick={() => deleteDebt(debt.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${debt.type === 'owed_by_me' ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
