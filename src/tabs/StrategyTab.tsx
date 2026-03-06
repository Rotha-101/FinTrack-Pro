import React, { useState } from 'react';
import { useStore } from '../store';
import { ShieldAlert, ShieldCheck, Shield, Lightbulb, Map, ArrowRight, Calculator, CreditCard, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export function StrategyTab() {
  const { profile, transactions } = useStore();
  
  const [debtAmount, setDebtAmount] = useState(5000);
  const [interestRate, setInterestRate] = useState(18);
  const [monthlyPayment, setMonthlyPayment] = useState(200);

  const [subscriptions, setSubscriptions] = useState([
    { id: '1', name: 'Netflix', cost: 15.99 },
    { id: '2', name: 'Spotify', cost: 9.99 },
    { id: '3', name: 'Gym Membership', cost: 45.00 }
  ]);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCost, setNewSubCost] = useState('');

  const totalMonthlySub = subscriptions.reduce((sum, sub) => sum + sub.cost, 0);
  const totalAnnualSub = totalMonthlySub * 12;

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubName && newSubCost) {
      setSubscriptions([...subscriptions, { id: Date.now().toString(), name: newSubName, cost: Number(newSubCost) }]);
      setNewSubName('');
      setNewSubCost('');
    }
  };

  const handleDeleteSub = (id: string) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  let grade = 'C';
  let GradeIcon = ShieldAlert;
  let gradeColor = 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
  let gradeMessage = 'Needs Improvement. Focus on reducing unnecessary expenses and building an emergency fund.';

  if (savingsRate >= 20) {
    grade = 'A';
    GradeIcon = ShieldCheck;
    gradeColor = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
    gradeMessage = 'Excellent! You are saving a healthy portion of your income. Consider investing the surplus.';
  } else if (savingsRate >= 10) {
    grade = 'B';
    GradeIcon = Shield;
    gradeColor = 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
    gradeMessage = 'Good job. You are on the right track. Try to optimize your budget to reach a 20% savings rate.';
  }

  const strategies = [
    { title: 'The 50/30/20 Rule', desc: 'Allocate 50% to needs, 30% to wants, and 20% to savings/investments.' },
    { title: 'Emergency Fund First', desc: 'Build a safety net of 3-6 months of living expenses before aggressive investing.' },
    { title: 'Automate Savings', desc: 'Set up automatic transfers to your savings account on payday.' },
    { title: 'Debt Avalanche', desc: 'Pay off debts with the highest interest rates first to save money long-term.' },
    { title: 'Zero-Based Budgeting', desc: 'Give every dollar a job. Income minus expenses should equal zero.' },
    { title: 'The 24-Hour Rule', desc: 'Wait 24 hours before making any non-essential purchase over $50.' },
    { title: 'Max Employer Match', desc: 'Always contribute enough to your retirement plan to get the full employer match.' },
    { title: 'Review Subscriptions', desc: 'Audit your monthly recurring charges every quarter and cancel unused ones.' },
  ];

  const calculatePayoff = () => {
    if (monthlyPayment <= (debtAmount * (interestRate / 100)) / 12) {
      return { months: Infinity, totalInterest: Infinity };
    }
    
    let balance = debtAmount;
    let months = 0;
    let totalInterest = 0;
    const monthlyRate = (interestRate / 100) / 12;
    
    while (balance > 0 && months < 1200) { // Cap at 100 years
      const interest = balance * monthlyRate;
      totalInterest += interest;
      balance = balance + interest - monthlyPayment;
      months++;
    }
    
    return { months, totalInterest };
  };

  const payoff = calculatePayoff();

  return (
    <div className="space-y-6">
      <div className={`p-8 rounded-3xl border ${gradeColor} flex flex-col md:flex-row items-center gap-8 transition-colors`}>
        <div className="flex-shrink-0 text-center">
          <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm mb-4 mx-auto transition-colors">
            <span className="text-6xl font-black">{grade}</span>
          </div>
          <div className="flex items-center justify-center gap-2 font-medium">
            <GradeIcon className="w-5 h-5" />
            Financial Health
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Your Current Status</h2>
          <p className="text-lg opacity-90 mb-6 dark:text-slate-300">{gradeMessage}</p>
          <div className="flex gap-6">
            <div>
              <div className="text-sm opacity-80 uppercase tracking-wider font-semibold mb-1">Savings Rate</div>
              <div className="text-2xl font-bold dark:text-white">{savingsRate.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-sm opacity-80 uppercase tracking-wider font-semibold mb-1">Annual Salary</div>
              <div className="text-2xl font-bold dark:text-white">${profile?.salary.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-zinc-800 dark:text-white mt-8 mb-4 flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-amber-500" />
        Expert Strategies
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {strategies.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <h4 className="font-semibold text-zinc-800 dark:text-white mb-2">{s.title}</h4>
            <p className="text-sm text-zinc-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 dark:bg-slate-900 text-white p-8 rounded-3xl mt-8 relative overflow-hidden border border-zinc-800 dark:border-slate-800">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Map className="w-48 h-48" />
        </div>
        <h3 className="text-2xl font-bold mb-2">12-Month Cambodia Roadmap</h3>
        <p className="text-zinc-400 dark:text-slate-400 mb-8 max-w-2xl">A specialized financial plan for expats and locals living in Cambodia, optimizing for local banking and investment opportunities.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="bg-zinc-800/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-zinc-700 dark:border-slate-700">
            <div className="text-blue-400 font-bold mb-2">Months 1-4: Foundation</div>
            <ul className="space-y-3 text-sm text-zinc-300 dark:text-slate-300">
              <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-zinc-500 dark:text-slate-500 shrink-0 mt-0.5"/> Open a high-yield ABA Bank or ACLEDA account.</li>
              <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-zinc-500 dark:text-slate-500 shrink-0 mt-0.5"/> Build a 3-month emergency fund in USD.</li>
              <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-zinc-500 dark:text-slate-500 shrink-0 mt-0.5"/> Track daily expenses (especially cash transactions).</li>
            </ul>
          </div>
          <div className="bg-zinc-800/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-zinc-700 dark:border-slate-700">
            <div className="text-emerald-400 font-bold mb-2">Months 5-8: Growth</div>
            <ul className="space-y-3 text-sm text-zinc-300 dark:text-slate-300">
              <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-zinc-500 dark:text-slate-500 shrink-0 mt-0.5"/> Explore local fixed-deposit rates (often 5-7%).</li>
              <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-zinc-500 dark:text-slate-500 shrink-0 mt-0.5"/> Set up a dedicated KHR account for daily local spending to avoid exchange fees.</li>
              <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-zinc-500 dark:text-slate-500 shrink-0 mt-0.5"/> Begin investing 10% of income.</li>
            </ul>
          </div>
          <div className="bg-zinc-800/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-zinc-700 dark:border-slate-700">
            <div className="text-purple-400 font-bold mb-2">Months 9-12: Expansion</div>
            <ul className="space-y-3 text-sm text-zinc-300 dark:text-slate-300">
              <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-zinc-500 dark:text-slate-500 shrink-0 mt-0.5"/> Research Cambodian real estate or REITs.</li>
              <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-zinc-500 dark:text-slate-500 shrink-0 mt-0.5"/> Optimize tax strategy with local professionals.</li>
              <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-zinc-500 dark:text-slate-500 shrink-0 mt-0.5"/> Review and adjust annual budget for the next year.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-xl font-bold text-zinc-800 dark:text-white mb-6 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-500" />
            Debt Payoff Calculator
          </h3>
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1.5">Total Debt Amount</label>
              <input
                type="number"
                value={debtAmount}
                onChange={e => setDebtAmount(Number(e.target.value))}
                className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1.5">Annual Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={e => setInterestRate(Number(e.target.value))}
                className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1.5">Monthly Payment</label>
              <input
                type="number"
                value={monthlyPayment}
                onChange={e => setMonthlyPayment(Number(e.target.value))}
                className="w-full bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
              />
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-6 flex flex-col justify-center">
            {payoff.months === Infinity ? (
              <div className="text-red-500 dark:text-red-400 font-medium text-center">
                Your monthly payment is too low to cover the interest. You will never pay off this debt.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider mb-1">Time to Payoff</div>
                  <div className="text-4xl font-black text-zinc-900 dark:text-white">
                    {Math.floor(payoff.months / 12)} <span className="text-xl font-medium text-zinc-500 dark:text-slate-400">yrs</span> {payoff.months % 12} <span className="text-xl font-medium text-zinc-500 dark:text-slate-400">mos</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-blue-200 dark:border-blue-800/50">
                  <div className="text-center">
                    <div className="text-xs text-zinc-500 dark:text-slate-400 uppercase font-semibold mb-1">Total Interest</div>
                    <div className="text-xl font-bold text-red-500 dark:text-red-400">{formatCurrency(payoff.totalInterest, profile?.currency)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-zinc-500 dark:text-slate-400 uppercase font-semibold mb-1">Total Paid</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-white">{formatCurrency(debtAmount + payoff.totalInterest, profile?.currency)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-zinc-100 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-xl font-bold text-zinc-800 dark:text-white mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-500" />
            Subscription Audit
          </h3>
          
          <div className="mb-6 flex gap-4">
            <div className="flex-1 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-2xl p-4 text-center">
              <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider mb-1">Monthly Cost</div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(totalMonthlySub, profile?.currency)}</div>
            </div>
            <div className="flex-1 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-2xl p-4 text-center">
              <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider mb-1">Annual Cost</div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(totalAnnualSub, profile?.currency)}</div>
            </div>
          </div>

          <form onSubmit={handleAddSub} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newSubName}
              onChange={e => setNewSubName(e.target.value)}
              placeholder="Netflix, Gym..."
              className="flex-1 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-colors"
            />
            <input
              type="number"
              value={newSubCost}
              onChange={e => setNewSubCost(e.target.value)}
              placeholder="Cost/mo"
              className="w-24 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-colors"
            />
            <button type="submit" disabled={!newSubName || !newSubCost} className="bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50">
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
            {subscriptions.map(sub => (
              <div key={sub.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-100 dark:border-slate-700/50 rounded-xl group transition-colors">
                <div className="font-medium text-zinc-800 dark:text-white">{sub.name}</div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(sub.cost, profile?.currency)}<span className="text-xs text-zinc-400 font-normal">/mo</span></div>
                  <button onClick={() => handleDeleteSub(sub.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {subscriptions.length === 0 && (
              <div className="text-center text-zinc-500 dark:text-slate-400 py-4 text-sm">No subscriptions added yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
