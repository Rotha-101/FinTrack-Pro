import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency, generateId } from '../lib/utils';
import { Plus, Trash2, LineChart } from 'lucide-react';

export function InvestmentsTab() {
  const { investments, addInvestment, deleteInvestment, profile } = useStore();
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [averagePrice, setAveragePrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !shares || isNaN(Number(shares)) || !averagePrice || isNaN(Number(averagePrice)) || !currentPrice || isNaN(Number(currentPrice))) return;
    
    addInvestment({
      id: generateId(),
      symbol: symbol.toUpperCase(),
      shares: Number(shares),
      averagePrice: Number(averagePrice),
      currentPrice: Number(currentPrice)
    });
    setSymbol('');
    setShares('');
    setAveragePrice('');
    setCurrentPrice('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg"><LineChart className="w-5 h-5" /></div>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Investment Portfolio</h3>
        </div>

        <form onSubmit={handleAddInvestment} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
          <input
            type="text"
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
            placeholder="Symbol (e.g. AAPL)"
            className="col-span-1 md:col-span-2 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors uppercase"
            required
          />
          <input
            type="number"
            value={shares}
            onChange={e => setShares(e.target.value)}
            placeholder="Shares"
            className="bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
            required
          />
          <input
            type="number"
            value={averagePrice}
            onChange={e => setAveragePrice(e.target.value)}
            placeholder="Avg Price"
            className="bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
            required
          />
          <input
            type="number"
            value={currentPrice}
            onChange={e => setCurrentPrice(e.target.value)}
            placeholder="Current Price"
            className="bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
            required
          />
          <button type="submit" className="col-span-1 md:col-span-5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Investment
          </button>
        </form>

        <div className="space-y-3">
          {investments.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-slate-400 text-center py-4">No investments tracked.</p>
          ) : (
            investments.map(inv => {
              const totalCost = inv.shares * inv.averagePrice;
              const currentValue = inv.shares * inv.currentPrice;
              const profitLoss = currentValue - totalCost;
              const profitLossPercentage = (profitLoss / totalCost) * 100;

              return (
                <div key={inv.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-slate-800/50 rounded-lg border border-zinc-100 dark:border-slate-700/50 group">
                  <div>
                    <span className="font-medium text-zinc-900 dark:text-white block">{inv.symbol}</span>
                    <span className="text-xs text-zinc-500 dark:text-slate-400">{inv.shares} shares @ {formatCurrency(inv.averagePrice, profile?.currency)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-bold text-zinc-900 dark:text-white block">{formatCurrency(currentValue, profile?.currency)}</span>
                      <span className={`text-xs font-medium ${profitLoss >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {profitLoss >= 0 ? '+' : ''}{formatCurrency(profitLoss, profile?.currency)} ({profitLossPercentage.toFixed(2)}%)
                      </span>
                    </div>
                    <button onClick={() => deleteInvestment(inv.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
