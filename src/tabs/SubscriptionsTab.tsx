import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency, generateId } from '../lib/utils';
import { Plus, Trash2, CreditCard } from 'lucide-react';

export function SubscriptionsTab() {
  const { subscriptions, addSubscription, deleteSubscription, profile } = useStore();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [nextBillingDate, setNextBillingDate] = useState('');

  const handleAddSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || !name || !nextBillingDate) return;
    
    addSubscription({
      id: generateId(),
      name,
      amount: Number(amount),
      billingCycle,
      nextBillingDate
    });
    setName('');
    setAmount('');
    setNextBillingDate('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg"><CreditCard className="w-5 h-5" /></div>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Active Subscriptions</h3>
        </div>

        <form onSubmit={handleAddSubscription} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Service Name"
            className="col-span-1 md:col-span-2 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-colors"
            required
          />
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
            className="bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-colors"
            required
          />
          <select
            value={billingCycle}
            onChange={e => setBillingCycle(e.target.value as 'monthly' | 'yearly')}
            className="bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-colors"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <input
            type="date"
            value={nextBillingDate}
            onChange={e => setNextBillingDate(e.target.value)}
            className="bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-colors"
            required
          />
          <button type="submit" className="col-span-1 md:col-span-5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Subscription
          </button>
        </form>

        <div className="space-y-3">
          {subscriptions.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-slate-400 text-center py-4">No active subscriptions.</p>
          ) : (
            subscriptions.map(sub => (
              <div key={sub.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-slate-800/50 rounded-lg border border-zinc-100 dark:border-slate-700/50 group">
                <div>
                  <span className="font-medium text-zinc-900 dark:text-white block">{sub.name}</span>
                  <span className="text-xs text-zinc-500 dark:text-slate-400">Next billing: {sub.nextBillingDate}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-zinc-900 dark:text-white block">{formatCurrency(sub.amount, profile?.currency)}</span>
                    <span className="text-xs text-zinc-500 dark:text-slate-400 uppercase">{sub.billingCycle}</span>
                  </div>
                  <button onClick={() => deleteSubscription(sub.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
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
