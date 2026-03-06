import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export function AnalyticsTab() {
  const { transactions, selectedYear, profile, theme } = useStore();
  const [subTab, setSubTab] = useState<'monthly' | 'category' | 'multi-year' | 'weekly' | 'income-expense-ratio' | 'savings-growth' | 'category-comparison'>('monthly');

  const chartTextColor = theme === 'dark' ? '#94a3b8' : '#a1a1aa';
  const chartGridColor = theme === 'dark' ? '#1e293b' : '#f4f4f5';
  const tooltipStyle = { borderRadius: '12px', border: 'none', backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', color: theme === 'dark' ? '#fff' : '#000', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

  const renderContent = () => {
    if (subTab === 'monthly') {
      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const monthStr = `${selectedYear}-${String(i + 1).padStart(2, '0')}`;
        const monthTxs = transactions.filter(t => t.date.startsWith(monthStr));
        return {
          name: new Date(selectedYear, i, 1).toLocaleString('default', { month: 'short' }),
          expense: monthTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
          income: monthTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        };
      });

      return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm h-[400px] transition-colors">
          <h3 className="text-lg font-semibold mb-6 text-zinc-900 dark:text-white">Monthly Income vs Expense ({selectedYear})</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              <Tooltip cursor={{ stroke: chartGridColor, strokeWidth: 2 }} contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (subTab === 'category') {
      const yearTxs = transactions.filter(t => t.date.startsWith(selectedYear.toString()) && t.type === 'expense');
      const categoryData = Object.entries(
        yearTxs.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({ name, value: Number(value) })).sort((a, b) => b.value - a.value);

      return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm h-[400px] transition-colors">
          <h3 className="text-lg font-semibold mb-6 text-zinc-900 dark:text-white">Top Expenses by Category ({selectedYear})</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={chartGridColor} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12, fontWeight: 500 }} width={100} />
              <Tooltip cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f4f4f5' }} formatter={(value: number) => formatCurrency(value, profile?.currency)} contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (subTab === 'multi-year') {
      const years = [2026, 2027, 2028, 2029, 2030];
      const multiYearData = years.map(year => {
        const yearTxs = transactions.filter(t => t.date.startsWith(year.toString()));
        return {
          name: year.toString(),
          expense: yearTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
          income: yearTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        };
      });

      return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm h-[400px] transition-colors">
          <h3 className="text-lg font-semibold mb-6 text-zinc-900 dark:text-white">Multi-Year Comparison (2026-2030)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={multiYearData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              <Tooltip cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f4f4f5' }} contentStyle={tooltipStyle} />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }
    if (subTab === 'weekly') {
      const yearTxs = transactions.filter(t => t.date.startsWith(selectedYear.toString()));
      // Group by week of the year
      const weeklyDataMap: Record<string, { expense: number, income: number }> = {};
      
      yearTxs.forEach(t => {
        const date = new Date(t.date);
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((date.getDay() + 1 + days) / 7);
        const weekKey = `Week ${weekNumber}`;
        
        if (!weeklyDataMap[weekKey]) {
          weeklyDataMap[weekKey] = { expense: 0, income: 0 };
        }
        if (t.type === 'expense') weeklyDataMap[weekKey].expense += t.amount;
        if (t.type === 'income') weeklyDataMap[weekKey].income += t.amount;
      });

      const weeklyData = Object.entries(weeklyDataMap).map(([name, data]) => ({
        name,
        expense: data.expense,
        income: data.income
      })).sort((a, b) => {
        const weekA = parseInt(a.name.split(' ')[1]);
        const weekB = parseInt(b.name.split(' ')[1]);
        return weekA - weekB;
      });

      return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm h-[400px] transition-colors">
          <h3 className="text-lg font-semibold mb-6 text-zinc-900 dark:text-white">Weekly Trends ({selectedYear})</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              <Tooltip cursor={{ stroke: chartGridColor, strokeWidth: 2 }} contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (subTab === 'income-expense-ratio') {
      const yearTxs = transactions.filter(t => t.date.startsWith(selectedYear.toString()));
      const totalIncome = yearTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = yearTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      const pieData = [
        { name: 'Income', value: totalIncome, color: '#10b981' },
        { name: 'Expense', value: totalExpense, color: '#ef4444' }
      ];

      return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm h-[400px] transition-colors">
          <h3 className="text-lg font-semibold mb-6 text-zinc-900 dark:text-white">Income vs Expense Ratio ({selectedYear})</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value, profile?.currency)} contentStyle={tooltipStyle} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (subTab === 'savings-growth') {
      let cumulativeSavings = 0;
      const savingsData = Array.from({ length: 12 }, (_, i) => {
        const monthStr = `${selectedYear}-${String(i + 1).padStart(2, '0')}`;
        const monthTxs = transactions.filter(t => t.date.startsWith(monthStr));
        const income = monthTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = monthTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const net = income - expense;
        cumulativeSavings += net;
        return {
          name: new Date(selectedYear, i, 1).toLocaleString('default', { month: 'short' }),
          savings: cumulativeSavings,
        };
      });

      return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm h-[400px] transition-colors">
          <h3 className="text-lg font-semibold mb-6 text-zinc-900 dark:text-white">Cumulative Savings Growth ({selectedYear})</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={savingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              <Tooltip cursor={{ stroke: chartGridColor, strokeWidth: 2 }} contentStyle={tooltipStyle} formatter={(value: number) => formatCurrency(value, profile?.currency)} />
              <Area type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (subTab === 'category-comparison') {
      const yearTxs = transactions.filter(t => t.date.startsWith(selectedYear.toString()) && t.type === 'expense');
      const categoryData = Object.entries(
        yearTxs.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({ subject: name, A: Number(value), fullMark: 1000 })).sort((a, b) => b.A - a.A).slice(0, 6); // Top 6 for radar

      return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm h-[400px] transition-colors">
          <h3 className="text-lg font-semibold mb-6 text-zinc-900 dark:text-white">Category Distribution Radar ({selectedYear})</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
              <PolarGrid stroke={chartGridColor} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: chartTextColor, fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: chartTextColor, fontSize: 10 }} />
              <Radar name="Expenses" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatCurrency(value, profile?.currency)} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-slate-800 transition-colors">
        {['monthly', 'category', 'multi-year', 'weekly', 'income-expense-ratio', 'savings-growth', 'category-comparison'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab as any)}
            className={`px-4 py-2 text-sm font-medium rounded-xl capitalize transition-all ${subTab === tab ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-zinc-500 dark:text-slate-400 hover:text-zinc-700 dark:hover:text-slate-200 hover:bg-zinc-50 dark:hover:bg-slate-800/50'}`}
          >
            {tab.replace(/-/g, ' ')}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
}
