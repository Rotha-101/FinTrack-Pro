import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency, generateId } from '../lib/utils';
import { Target, Plus, Trash2, Edit2, Check, Calendar } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

export function GoalsTab() {
  const { goals, addGoal, updateGoal, deleteGoal, profile } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [color, setColor] = useState('#3b82f6');

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const handleSave = () => {
    if (!name || !targetAmount) return;

    if (editingId) {
      updateGoal({
        id: editingId,
        name,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount) || 0,
        icon: 'target',
        color,
        deadline: deadline || undefined
      });
      setEditingId(null);
    } else {
      addGoal({
        id: generateId(),
        name,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount) || 0,
        icon: 'target',
        color,
        deadline: deadline || undefined
      });
      setIsAdding(false);
    }
    
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
    setPriority('Medium');
    setColor('#3b82f6');
  };

  const startEdit = (goal: any) => {
    setEditingId(goal.id);
    setName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setDeadline(goal.deadline || '');
    setPriority(goal.priority || 'Medium');
    setColor(goal.color);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Financial Goals</h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Goal
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">{editingId ? 'Edit Goal' : 'Create New Goal'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1">Goal Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. New Car" className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1">Target Amount</label>
              <input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="10000" className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1">Current Saved</label>
              <input type="number" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} placeholder="0" className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1">Target Date (Optional)</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as any)} className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors appearance-none">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-2">Color Theme</label>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${color === c ? 'scale-110 ring-2 ring-offset-2 ring-zinc-400 dark:ring-slate-500 dark:ring-offset-slate-900' : ''}`}
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="px-4 py-2 text-zinc-600 dark:text-slate-400 font-medium hover:bg-zinc-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Save Goal
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...goals].sort((a, b) => {
          const pMap = { High: 3, Medium: 2, Low: 1 };
          return (pMap[b.priority || 'Medium'] || 2) - (pMap[a.priority || 'Medium'] || 2);
        }).map(goal => {
          const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = goal.targetAmount - goal.currentAmount;
          let daysLeft = null;
          if (goal.deadline) {
            daysLeft = differenceInDays(parseISO(goal.deadline), new Date());
          }
          
          return (
            <div key={goal.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm relative group transition-colors">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(goal)} className="p-1.5 text-zinc-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => deleteGoal(goal.id)} className="p-1.5 text-zinc-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-sm" style={{ backgroundColor: goal.color }}>
                <Target className="w-6 h-6" />
              </div>
              
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-white">{goal.name}</h3>
                {goal.priority && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                    goal.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
                    goal.priority === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                  }`}>
                    {goal.priority}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-black text-zinc-900 dark:text-white">{formatCurrency(goal.currentAmount, profile?.currency)}</span>
                <span className="text-sm text-zinc-500 dark:text-slate-400">of {formatCurrency(goal.targetAmount, profile?.currency)}</span>
              </div>

              {goal.deadline && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-slate-400 mb-6 bg-zinc-50 dark:bg-slate-800/50 w-fit px-2.5 py-1 rounded-md border border-zinc-100 dark:border-slate-700">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(parseISO(goal.deadline), 'MMM d, yyyy')}
                  {daysLeft !== null && daysLeft > 0 && (
                    <span className="ml-1 text-blue-500 dark:text-blue-400">({daysLeft} days left)</span>
                  )}
                  {daysLeft !== null && daysLeft <= 0 && (
                    <span className="ml-1 text-red-500 dark:text-red-400">(Overdue)</span>
                  )}
                </div>
              )}
              {!goal.deadline && <div className="mb-6"></div>}

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-zinc-600 dark:text-slate-400">Progress</span>
                  <span style={{ color: goal.color }}>{progress}%</span>
                </div>
                <div className="h-2.5 w-full bg-zinc-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: goal.color }}
                  />
                </div>
                {remaining > 0 && (
                  <p className="text-xs text-zinc-500 dark:text-slate-500 text-right mt-2">
                    {formatCurrency(remaining, profile?.currency)} remaining
                  </p>
                )}
              </div>
            </div>
          );
        })}
        
        {goals.length === 0 && !isAdding && (
          <div className="col-span-full bg-zinc-50 dark:bg-slate-900/50 border-2 border-dashed border-zinc-200 dark:border-slate-800 rounded-3xl p-12 text-center transition-colors">
            <Target className="w-12 h-12 text-zinc-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-700 dark:text-slate-300 mb-2">No goals set yet</h3>
            <p className="text-zinc-500 dark:text-slate-500 mb-6">Create your first financial goal to start tracking your progress.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-zinc-800 dark:text-white px-6 py-2.5 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              Create Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
