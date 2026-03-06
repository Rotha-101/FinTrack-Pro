import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Lock, Bell, Moon, Sun, Wifi, WifiOff, Wallet, Activity, Target, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export function Topbar() {
  const { selectedYear, setSelectedYear, lock, profile, theme, toggleTheme, transactions, goals } = useStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayTxs = transactions.filter(t => t.date === today);
  const spentToday = todayTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const budgetLeft = (profile?.dailyBudget || 0) - spentToday;
  
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netWorth = totalIncome - totalExpense;

  const years = [2026, 2027, 2028, 2029, 2030];

  const currentMonthStr = `${selectedYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const currentMonthTxs = transactions.filter(t => t.date.startsWith(currentMonthStr));
  const currentMonthIncome = currentMonthTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const currentMonthExpense = currentMonthTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const monthlySavings = currentMonthIncome - currentMonthExpense;

  const activeGoalsCount = goals?.filter(g => g.currentAmount < g.targetAmount).length || 0;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-zinc-200 dark:border-slate-800 px-4 sm:px-6 py-3 shrink-0 transition-colors">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title & Online Status */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-2xl tracking-tight dark:text-white leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">FinTrack Pro</span>
            <span className="text-xs text-zinc-500 dark:text-slate-400 font-medium mt-1">Developed by Chea Rotha</span>
          </div>
          
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isOnline ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>

        {/* Mini Statuses */}
        <div className="hidden lg:flex items-center gap-6 text-sm flex-1 justify-center">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-zinc-400 dark:text-slate-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 dark:text-slate-400 uppercase font-bold tracking-wider">Net Worth</span>
              <span className="font-semibold dark:text-white">{formatCurrency(netWorth, profile?.currency)}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-zinc-200 dark:bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-zinc-400 dark:text-slate-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 dark:text-slate-400 uppercase font-bold tracking-wider">Today's Budget</span>
              <span className={`font-semibold ${budgetLeft >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {budgetLeft >= 0 ? '+' : ''}{formatCurrency(budgetLeft, profile?.currency)}
              </span>
            </div>
          </div>
          <div className="w-px h-8 bg-zinc-200 dark:bg-slate-800"></div>
          <div className="flex items-center gap-2">
            {monthlySavings >= 0 ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 dark:text-slate-400 uppercase font-bold tracking-wider">Mo. Savings</span>
              <span className={`font-semibold ${monthlySavings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {monthlySavings >= 0 ? '+' : ''}{formatCurrency(monthlySavings, profile?.currency)}
              </span>
            </div>
          </div>
          <div className="w-px h-8 bg-zinc-200 dark:bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-zinc-400 dark:text-slate-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 dark:text-slate-400 uppercase font-bold tracking-wider">Active Goals</span>
              <span className="font-semibold dark:text-white">{activeGoalsCount}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-zinc-200 dark:bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-zinc-400 dark:text-slate-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 dark:text-slate-400 uppercase font-bold tracking-wider">Sync Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Synced</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-zinc-700 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-1.5 outline-none transition-colors"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <button onClick={toggleTheme} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-slate-200 hover:bg-zinc-50 dark:hover:bg-slate-800 rounded-full transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-slate-200 hover:bg-zinc-50 dark:hover:bg-slate-800 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          {profile?.password && (
            <button 
              onClick={lock}
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-slate-200 hover:bg-zinc-50 dark:hover:bg-slate-800 rounded-full transition-colors"
              title="Lock App"
            >
              <Lock className="w-5 h-5" />
            </button>
          )}

          <div className="w-px h-6 bg-zinc-200 dark:bg-slate-800 mx-1"></div>

          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-slate-700" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium border border-blue-200 dark:border-blue-800">
              {profile?.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
