import React, { useState } from 'react';
import { useStore } from '../store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, getDay } from 'date-fns';
import { cn, formatCurrency, generateId } from '../lib/utils';
import { Plus, Trash2, ChevronLeft, ChevronRight, Zap, Edit2, X } from 'lucide-react';
import { Transaction } from '../types';

export function DailyLogTab() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, profile, selectedYear, categories } = useStore();
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedYear, new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [editingId, setEditingId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [note, setNote] = useState('');

  React.useEffect(() => {
    if (categories.length > 0 && !category && !editingId) {
      setCategory(categories[0]);
    }
  }, [categories, category, editingId]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const startDayOfWeek = getDay(startOfMonth(currentMonth));
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTransactions = transactions.filter(t => t.date === selectedDateStr);
  const dayTotal = dayTransactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);

  const QUICK_ADDS = [
    { label: 'Coffee', amount: 4.5, category: 'Food', type: 'expense' as const },
    { label: 'Lunch', amount: 15, category: 'Food', type: 'expense' as const },
    { label: 'Transport', amount: 5, category: 'Transport', type: 'expense' as const },
  ];

  const handleQuickAdd = (quickAdd: typeof QUICK_ADDS[0]) => {
    addTransaction({
      id: generateId(),
      date: selectedDateStr,
      amount: quickAdd.amount,
      category: quickAdd.category,
      type: quickAdd.type,
      note: quickAdd.label
    });
  };

  const handleEdit = (t: Transaction) => {
    setEditingId(t.id);
    setAmount(t.amount.toString());
    setCategory(t.category);
    setType(t.type);
    setNote(t.note);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setAmount('');
    setCategory(categories[0] || '');
    setType('expense');
    setNote('');
  };

  const handleAddOrUpdateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    if (editingId) {
      updateTransaction({
        id: editingId,
        date: selectedDateStr,
        amount: Number(amount),
        category,
        type,
        note
      });
      cancelEdit();
    } else {
      addTransaction({
        id: generateId(),
        date: selectedDateStr,
        amount: Number(amount),
        category,
        type,
        note
      });
      setAmount('');
      setNote('');
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
      {/* Calendar View */}
      <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm p-6 flex flex-col transition-colors min-h-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white tracking-tight">{format(currentMonth, 'MMMM yyyy')}</h2>
          <div className="flex gap-1 bg-zinc-100 dark:bg-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors text-zinc-600 dark:text-slate-400 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors text-zinc-600 dark:text-slate-400 shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-[10px] font-semibold text-zinc-400 dark:text-slate-500 uppercase tracking-wider py-1">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-fr">
          {paddingDays.map(pad => (
            <div key={`pad-${pad}`} className="p-1" />
          ))}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayTxs = transactions.filter(t => t.date === dateStr);
            const spent = dayTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            
            const budget = profile?.dailyBudget || 50;

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-lg p-1 transition-all group h-full border border-transparent",
                  !isSameMonth(day, currentMonth) && "opacity-30",
                  isSameDay(day, selectedDate) 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                    : "hover:bg-zinc-100 dark:hover:bg-slate-800 text-zinc-700 dark:text-slate-300",
                  isSameDay(day, new Date()) && !isSameDay(day, selectedDate) && "border-blue-500/50 bg-blue-50/50 dark:bg-blue-500/10"
                )}
              >
                <span className="text-sm font-medium z-10">{format(day, 'd')}</span>
                {spent > 0 && (
                  <div className="flex gap-0.5 mt-0.5 z-10">
                    <div className={cn("w-1 h-1 rounded-full", spent > budget ? "bg-red-400" : spent > budget * 0.8 ? "bg-amber-400" : "bg-emerald-400", isSameDay(day, selectedDate) && "bg-white")} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Editor Panel */}
      <div className="w-full lg:w-[420px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-zinc-200/50 dark:border-slate-800/50 shadow-sm p-6 flex flex-col transition-colors min-h-0">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white tracking-tight">{format(selectedDate, 'EEEE, MMMM d')}</h3>
          <p className="text-xs text-zinc-500 dark:text-slate-400 mt-1">Net Flow: <span className={dayTotal >= 0 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>{formatCurrency(dayTotal, profile?.currency)}</span></p>
        </div>

        <form onSubmit={handleAddOrUpdateTransaction} className="space-y-3 mb-6">
          <div className="flex bg-zinc-100/80 dark:bg-slate-800/80 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-all", type === 'expense' ? "bg-white dark:bg-slate-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-slate-400")}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-all", type === 'income' ? "bg-white dark:bg-slate-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-slate-400")}
            >
              Income
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
              required
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
          />

          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
              {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? 'Update Record' : 'Add Record'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-zinc-700 dark:text-slate-300 text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center shadow-sm">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {!editingId && (
          <div className="mb-6">
            <h4 className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Quick Add
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ADDS.map((qa, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAdd(qa)}
                  className="px-2.5 py-1 bg-zinc-100/80 hover:bg-zinc-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-zinc-700 dark:text-slate-300 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 border border-zinc-200/50 dark:border-slate-700/50"
                >
                  <span>{qa.label}</span>
                  <span className="text-zinc-400 dark:text-slate-500 text-[10px]">{formatCurrency(qa.amount, profile?.currency)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-1">
          <h4 className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-widest mb-3">Today's Records</h4>
          {dayTransactions.length === 0 ? (
            <p className="text-xs text-zinc-400 dark:text-slate-500 text-center py-8">No transactions today.</p>
          ) : (
            <div className="space-y-2">
              {dayTransactions.map(t => (
                <div key={t.id} className="bg-zinc-50 dark:bg-slate-800/50 p-3 rounded-lg border border-zinc-100 dark:border-slate-700/50 group transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", t.type === 'income' ? 'bg-emerald-500' : 'bg-red-500')} />
                    <div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">{t.category}</div>
                      {t.note && <div className="text-xs text-zinc-500 dark:text-slate-400">{t.note}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn("text-sm font-bold", t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white")}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, profile?.currency)}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(t)}
                        className="p-1 text-zinc-400 hover:text-blue-500 transition-colors rounded-md hover:bg-zinc-200 dark:hover:bg-slate-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="p-1 text-zinc-400 hover:text-red-500 transition-colors rounded-md hover:bg-zinc-200 dark:hover:bg-slate-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
