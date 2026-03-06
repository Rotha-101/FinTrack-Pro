import React from 'react';
import { LayoutDashboard, CalendarDays, BarChart3, Lightbulb, Target, FileText, Settings, Wallet, CreditCard, Landmark, Receipt, LineChart } from 'lucide-react';
import { cn } from '../lib/utils';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'daily', label: 'Daily Log', icon: CalendarDays },
  { id: 'accounts', label: 'Accounts', icon: Landmark },
  { id: 'budgets', label: 'Budgets', icon: Wallet },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'debts', label: 'Debts', icon: Receipt },
  { id: 'investments', label: 'Investments', icon: LineChart },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'strategy', label: 'Strategy', icon: Lightbulb },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Navigation({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-slate-800 overflow-x-auto scrollbar-hide transition-colors sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex space-x-2 py-3">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : "text-zinc-600 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-slate-800 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
