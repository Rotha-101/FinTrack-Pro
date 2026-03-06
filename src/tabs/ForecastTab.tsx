import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency } from '../lib/utils';
import { Calculator, TrendingUp, PiggyBank } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ForecastTab() {
  const { profile, theme } = useStore();
  const [initialAmount, setInitialAmount] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [interestRate, setInterestRate] = useState(5);
  const [years, setYears] = useState(5);

  const calculateCompoundInterest = () => {
    let balance = initialAmount;
    const monthlyRate = (interestRate / 100) / 12;
    const months = years * 12;
    
    const data = [];
    for (let i = 1; i <= years; i++) {
      for (let j = 0; j < 12; j++) {
        balance = balance * (1 + monthlyRate) + monthlyContribution;
      }
      data.push({
        year: i,
        balance: Math.round(balance),
        contributions: initialAmount + (monthlyContribution * 12 * i),
        interest: Math.round(balance - (initialAmount + (monthlyContribution * 12 * i)))
      });
    }
    return data;
  };

  const forecastData = calculateCompoundInterest();
  const finalBalance = forecastData[forecastData.length - 1]?.balance || 0;

  const chartTextColor = theme === 'dark' ? '#94a3b8' : '#a1a1aa';
  const chartGridColor = theme === 'dark' ? '#1e293b' : '#f4f4f5';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm col-span-1 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg"><Calculator className="w-5 h-5" /></div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Compound Calculator</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1">Initial Amount</label>
              <input type="number" value={initialAmount} onChange={e => setInitialAmount(Number(e.target.value))} className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1">Monthly Contribution</label>
              <input type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(Number(e.target.value))} className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1">Annual Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1">Years to Grow</label>
              <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors" />
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Projected Balance</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(finalBalance, profile?.currency)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm col-span-1 lg:col-span-2 transition-colors">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-6">Year-by-Year Projection</h3>
          
          <div className="h-64 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                <XAxis dataKey="year" tickFormatter={(value) => `Year ${value}`} stroke={chartTextColor} tick={{ fill: chartTextColor, fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} stroke={chartTextColor} tick={{ fill: chartTextColor, fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, profile?.currency)}
                  labelFormatter={(label) => `Year ${label}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', color: theme === 'dark' ? '#fff' : '#000', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="balance" name="Total Balance" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: theme === 'dark' ? '#0f172a' : '#fff' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="contributions" name="Total Contributions" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: theme === 'dark' ? '#0f172a' : '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-slate-800">
                  <th className="pb-3 text-sm font-medium text-zinc-500 dark:text-slate-400">Year</th>
                  <th className="pb-3 text-sm font-medium text-zinc-500 dark:text-slate-400">Total Contributions</th>
                  <th className="pb-3 text-sm font-medium text-zinc-500 dark:text-slate-400">Total Interest</th>
                  <th className="pb-3 text-sm font-medium text-zinc-500 dark:text-slate-400 text-right">End Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-slate-800">
                {forecastData.map((data, idx) => (
                  <tr key={data.year} className="hover:bg-zinc-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-zinc-900 dark:text-white">Year {data.year}</td>
                    <td className="py-4 text-sm text-zinc-600 dark:text-slate-300">{formatCurrency(data.contributions, profile?.currency)}</td>
                    <td className="py-4 text-sm text-emerald-600 dark:text-emerald-400">+{formatCurrency(data.interest, profile?.currency)}</td>
                    <td className="py-4 text-sm font-bold text-zinc-900 dark:text-white text-right">{formatCurrency(data.balance, profile?.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-400 rounded-lg"><PiggyBank className="w-5 h-5" /></div>
            <h4 className="font-semibold text-zinc-800 dark:text-white">Conservative</h4>
          </div>
          <p className="text-sm text-zinc-500 dark:text-slate-400 mb-4">Low risk, steady growth. Assumes 3% annual return.</p>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            {formatCurrency(initialAmount * Math.pow(1 + 0.03, years) + monthlyContribution * 12 * ((Math.pow(1 + 0.03, years) - 1) / 0.03), profile?.currency)}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-blue-100 dark:border-blue-500/30 shadow-sm ring-1 ring-blue-500/20 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            <h4 className="font-semibold text-zinc-800 dark:text-white">Balanced</h4>
          </div>
          <p className="text-sm text-zinc-500 dark:text-slate-400 mb-4">Moderate risk, market average. Assumes 7% annual return.</p>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(initialAmount * Math.pow(1 + 0.07, years) + monthlyContribution * 12 * ((Math.pow(1 + 0.07, years) - 1) / 0.07), profile?.currency)}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            <h4 className="font-semibold text-zinc-800 dark:text-white">Aggressive</h4>
          </div>
          <p className="text-sm text-zinc-500 dark:text-slate-400 mb-4">High risk, high reward. Assumes 10% annual return.</p>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            {formatCurrency(initialAmount * Math.pow(1 + 0.10, years) + monthlyContribution * 12 * ((Math.pow(1 + 0.10, years) - 1) / 0.10), profile?.currency)}
          </div>
        </div>
      </div>
    </div>
  );
}
