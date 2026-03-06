import React, { useState } from 'react';
import { StoreProvider, useStore } from './store';
import { Topbar } from './components/Topbar';
import { Navigation } from './components/Navigation';
import { Onboarding } from './components/Onboarding';
import { LockScreen } from './components/LockScreen';
import { cn } from './lib/utils';

// Tabs
import { DashboardTab } from './tabs/DashboardTab';
import { DailyLogTab } from './tabs/DailyLogTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { StrategyTab } from './tabs/StrategyTab';
import { GoalsTab } from './tabs/GoalsTab';
import { ReportsTab } from './tabs/ReportsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { BudgetsTab } from './tabs/BudgetsTab';
import { SubscriptionsTab } from './tabs/SubscriptionsTab';
import { AccountsTab } from './tabs/AccountsTab';
import { DebtsTab } from './tabs/DebtsTab';
import { InvestmentsTab } from './tabs/InvestmentsTab';

function MainApp() {
  const { isLocked, hasCompletedOnboarding, profile, theme } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!hasCompletedOnboarding || !profile) {
    return <div className={cn(theme === 'dark' ? 'dark' : '')}><Onboarding /></div>;
  }

  if (isLocked) {
    return <div className={cn(theme === 'dark' ? 'dark' : '')}><LockScreen /></div>;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab onTabChange={setActiveTab} />;
      case 'daily': return <DailyLogTab />;
      case 'accounts': return <AccountsTab />;
      case 'budgets': return <BudgetsTab />;
      case 'subscriptions': return <SubscriptionsTab />;
      case 'debts': return <DebtsTab />;
      case 'investments': return <InvestmentsTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'strategy': return <StrategyTab />;
      case 'goals': return <GoalsTab />;
      case 'reports': return <ReportsTab />;
      case 'settings': return <SettingsTab />;
      default: return <DashboardTab onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className={cn("min-h-screen flex flex-col font-sans transition-colors duration-200", theme === 'dark' ? 'dark bg-slate-950 text-slate-50' : 'bg-slate-50 text-zinc-900')}>
      <Topbar />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full flex flex-col max-w-7xl mx-auto">
        {renderTab()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
