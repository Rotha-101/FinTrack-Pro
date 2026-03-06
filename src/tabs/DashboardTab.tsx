import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency, generateId } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Activity, ArrowUpRight, ArrowDownRight, Target, Plus, Download, PieChart as PieChartIcon, Edit2, Trash2, X, Check } from 'lucide-react';
import { Transaction, Goal } from '../types';

export function DashboardTab({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  const { profile, transactions, selectedYear, theme, goals, addTransaction, updateTransaction, deleteTransaction, categories, addGoal, updateGoal, deleteGoal } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalColor, setGoalColor] = useState('#3b82f6');
  const COLORS_GOAL = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const yearTransactions = transactions.filter(t => t.date.startsWith(selectedYear.toString()));
  
  const totalIncome = yearTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const expensesByCategory = yearTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value: Number(value) }));
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthStr = `${selectedYear}-${String(i + 1).padStart(2, '0')}`;
    const monthTxs = yearTransactions.filter(t => t.date.startsWith(monthStr));
    const income = monthTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return {
      name: new Date(selectedYear, i, 1).toLocaleString('default', { month: 'short' }),
      income,
      expense,
    };
  });

  const chartTextColor = theme === 'dark' ? '#94a3b8' : '#a1a1aa';
  const chartGridColor = theme === 'dark' ? '#1e293b' : '#f4f4f5';

  const currentMonthStr = `${selectedYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const currentMonthTxs = yearTransactions.filter(t => t.date.startsWith(currentMonthStr));
  const currentMonthExpense = currentMonthTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  const lastMonthStr = `${selectedYear}-${String(new Date().getMonth()).padStart(2, '0')}`;
  const lastMonthTxs = yearTransactions.filter(t => t.date.startsWith(lastMonthStr));
  const lastMonthExpense = lastMonthTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const expenseChange = lastMonthExpense ? ((currentMonthExpense - lastMonthExpense) / lastMonthExpense) * 100 : 0;

  const uniqueDaysWithTxs = new Set(yearTransactions.map(t => t.date)).size;
  const averageDaily = uniqueDaysWithTxs > 0 ? totalExpense / uniqueDaysWithTxs : 0;

  const topCategories = Object.entries(expensesByCategory)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3);

  const openAddModal = () => {
    setEditingId(null);
    setAmount('');
    setCategory(categories[0] || '');
    setType('expense');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Transaction) => {
    setEditingId(t.id);
    setAmount(t.amount.toString());
    setCategory(t.category);
    setType(t.type);
    setNote(t.note || '');
    setDate(t.date);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    if (editingId) {
      updateTransaction({
        id: editingId,
        date,
        amount: Number(amount),
        category,
        type,
        note
      });
    } else {
      addTransaction({
        id: generateId(),
        date,
        amount: Number(amount),
        category,
        type,
        note
      });
    }
    setIsModalOpen(false);
  };

  const openAddGoalModal = () => {
    setEditingGoalId(null);
    setGoalName('');
    setGoalTarget('');
    setGoalCurrent('0');
    setGoalColor('#3b82f6');
    setIsGoalModalOpen(true);
  };

  const openEditGoalModal = (g: Goal) => {
    setEditingGoalId(g.id);
    setGoalName(g.name);
    setGoalTarget(g.targetAmount.toString());
    setGoalCurrent(g.currentAmount.toString());
    setGoalColor(g.color || '#3b82f6');
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !goalTarget || isNaN(Number(goalTarget)) || isNaN(Number(goalCurrent))) return;

    if (editingGoalId) {
      const existingGoal = goals.find(g => g.id === editingGoalId);
      if (existingGoal) {
        updateGoal({
          ...existingGoal,
          name: goalName,
          targetAmount: Number(goalTarget),
          currentAmount: Number(goalCurrent),
          color: goalColor
        });
      }
    } else {
      addGoal({
        id: generateId(),
        name: goalName,
        targetAmount: Number(goalTarget),
        currentAmount: Number(goalCurrent),
        color: goalColor,
        icon: 'target'
      });
    }
    setIsGoalModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm transition-colors">
          <div className="flex items-center gap-3 text-zinc-500 dark:text-slate-400 mb-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg"><Wallet className="w-4 h-4" /></div>
            <span className="font-medium text-xs uppercase tracking-wider">Net Balance</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(balance, profile?.currency)}</div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm transition-colors">
          <div className="flex items-center gap-3 text-zinc-500 dark:text-slate-400 mb-2">
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg"><TrendingUp className="w-4 h-4" /></div>
            <span className="font-medium text-xs uppercase tracking-wider">Total Income</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(totalIncome, profile?.currency)}</div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm transition-colors">
          <div className="flex items-center gap-3 text-zinc-500 dark:text-slate-400 mb-2">
            <div className="p-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg"><TrendingDown className="w-4 h-4" /></div>
            <span className="font-medium text-xs uppercase tracking-wider">Total Expenses</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(totalExpense, profile?.currency)}</div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm transition-colors">
          <div className="flex items-center gap-3 text-zinc-500 dark:text-slate-400 mb-2">
            <div className="p-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg"><DollarSign className="w-4 h-4" /></div>
            <span className="font-medium text-xs uppercase tracking-wider">Savings Rate</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            {totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm transition-colors">
          <div className="flex items-center gap-3 text-zinc-500 dark:text-slate-400 mb-2">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg"><Activity className="w-4 h-4" /></div>
            <span className="font-medium text-xs uppercase tracking-wider">Daily Avg</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(averageDaily, profile?.currency)}</div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm transition-colors relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 dark:text-slate-400 mb-2">
            <span className="font-medium text-xs uppercase tracking-wider">MoM Change</span>
            {expenseChange !== 0 && (
              <div className={`flex items-center text-xs font-bold ${expenseChange > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {expenseChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(expenseChange).toFixed(1)}%
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(currentMonthExpense, profile?.currency)}</div>
          <div className="text-xs text-zinc-400 dark:text-slate-500 mt-1">spent this month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm transition-colors">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-6">Annual Overview</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f4f4f5' }} contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', color: theme === 'dark' ? '#fff' : '#000', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm transition-colors">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-6 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-purple-500" />
                Top Spending Categories
              </h3>
              <div className="space-y-4">
                {topCategories.map(([category, amount], index) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-slate-800/50 rounded-lg border border-zinc-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-zinc-800 dark:text-white text-sm">{category}</span>
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-white text-sm">{formatCurrency(amount, profile?.currency)}</span>
                  </div>
                ))}
                {topCategories.length === 0 && (
                  <p className="text-center text-zinc-500 dark:text-slate-400 py-4 text-sm">No expenses recorded yet.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={openAddModal}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" /> Add Transaction
              </button>
              <button 
                onClick={() => onTabChange?.('reports')}
                className="flex-1 bg-zinc-100 dark:bg-slate-800 hover:bg-zinc-200 dark:hover:bg-slate-700 text-zinc-800 dark:text-white p-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors shadow-sm border border-zinc-200 dark:border-slate-700"
              >
                <Download className="w-5 h-5" /> Export Data
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm flex flex-col transition-colors">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-6">Expenses by Category</h3>
          {pieData.length > 0 ? (
            <div className="flex-1 min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(Number(value), profile?.currency)} contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                <span className="text-sm text-zinc-400 dark:text-slate-500">Total</span>
                <span className="text-xl font-bold text-zinc-800 dark:text-white">{formatCurrency(totalExpense, profile?.currency)}</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-400 dark:text-slate-500 text-sm">
              No expenses recorded yet.
            </div>
          )}
          
          <div className="mt-4 space-y-2">
            {pieData.sort((a, b) => b.value - a.value).slice(0, 4).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-zinc-600 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="font-medium text-zinc-900 dark:text-white">{formatCurrency(item.value, profile?.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm transition-colors">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-slate-800">
                  <th className="pb-3 text-sm font-medium text-zinc-500 dark:text-slate-400">Date</th>
                  <th className="pb-3 text-sm font-medium text-zinc-500 dark:text-slate-400">Category</th>
                  <th className="pb-3 text-sm font-medium text-zinc-500 dark:text-slate-400 text-right">Amount</th>
                  <th className="pb-3 text-sm font-medium text-zinc-500 dark:text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-slate-800">
                {yearTransactions.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map(t => (
                  <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="py-4 text-sm text-zinc-600 dark:text-slate-300">{t.date}</td>
                    <td className="py-4 text-sm font-medium text-zinc-900 dark:text-white">{t.category}</td>
                    <td className={`py-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, profile?.currency)}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(t)} className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-zinc-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteTransaction(t.id)} className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {yearTransactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-zinc-500 dark:text-slate-400">
                      No transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Active Goals Progress
            </h3>
            <button onClick={openAddGoalModal} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-5">
            {goals && goals.length > 0 ? (
              goals.slice(0, 4).map(goal => {
                const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div key={goal.id} className="space-y-2 group">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-zinc-900 dark:text-white text-sm">{goal.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-zinc-500 dark:text-slate-400">{progress}%</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditGoalModal(goal)} className="p-1 text-zinc-400 hover:text-blue-500 hover:bg-zinc-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteGoal(goal.id)} className="p-1 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, backgroundColor: goal.color || '#3b82f6' }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500 dark:text-slate-400">
                      <span>{formatCurrency(goal.currentAmount, profile?.currency)}</span>
                      <span>{formatCurrency(goal.targetAmount, profile?.currency)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-sm text-zinc-500 dark:text-slate-400">
                No active goals. Set one up in the Goals tab!
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md border border-zinc-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {editingId ? 'Edit Transaction' : 'Add Transaction'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTransaction} className="p-4 space-y-4">
              <div className="flex bg-zinc-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'expense' ? 'bg-white dark:bg-slate-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-slate-400'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'income' ? 'bg-white dark:bg-slate-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-slate-400'}`}
                >
                  Income
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-slate-400 mb-1">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-slate-400 mb-1">Note (Optional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Note"
                  className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingId ? 'Update Transaction' : 'Save Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md border border-zinc-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {editingGoalId ? 'Edit Goal' : 'Add Goal'}
              </h3>
              <button onClick={() => setIsGoalModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveGoal} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-slate-400 mb-1">Goal Name</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-slate-400 mb-1">Target Amount</label>
                  <input
                    type="number"
                    value={goalTarget}
                    onChange={e => setGoalTarget(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-slate-400 mb-1">Current Saved</label>
                  <input
                    type="number"
                    value={goalCurrent}
                    onChange={e => setGoalCurrent(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-slate-400 mb-2">Color Theme</label>
                <div className="flex gap-2">
                  {COLORS_GOAL.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setGoalColor(c)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${goalColor === c ? 'scale-110 ring-2 ring-offset-2 ring-zinc-400 dark:ring-slate-500 dark:ring-offset-slate-900' : ''}`}
                      style={{ backgroundColor: c }}
                    >
                      {goalColor === c && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                {editingGoalId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingGoalId ? 'Update Goal' : 'Save Goal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
