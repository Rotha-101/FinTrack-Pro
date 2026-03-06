import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, UserProfile, Transaction, Goal, Budget, Subscription, Account, Debt, Investment } from './types';
import { loadState, saveState, defaultState } from './lib/storage';

interface StoreContextType extends AppState {
  setProfile: (profile: UserProfile) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  addSubscription: (subscription: Subscription) => void;
  updateSubscription: (subscription: Subscription) => void;
  deleteSubscription: (id: string) => void;
  addAccount: (account: Account) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  addDebt: (debt: Debt) => void;
  updateDebt: (debt: Debt) => void;
  deleteDebt: (id: string) => void;
  addInvestment: (investment: Investment) => void;
  updateInvestment: (investment: Investment) => void;
  deleteInvestment: (id: string) => void;
  setSelectedYear: (year: number) => void;
  unlock: () => void;
  lock: () => void;
  completeOnboarding: () => void;
  toggleTheme: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setProfile = (profile: UserProfile) => setState(s => ({ ...s, profile }));
  const addTransaction = (transaction: Transaction) => setState(s => ({ ...s, transactions: [...s.transactions, transaction] }));
  const updateTransaction = (transaction: Transaction) => setState(s => ({ ...s, transactions: s.transactions.map(t => t.id === transaction.id ? transaction : t) }));
  const deleteTransaction = (id: string) => setState(s => ({ ...s, transactions: s.transactions.filter(t => t.id !== id) }));
  const addGoal = (goal: Goal) => setState(s => ({ ...s, goals: [...s.goals, goal] }));
  const updateGoal = (goal: Goal) => setState(s => ({ ...s, goals: s.goals.map(g => g.id === goal.id ? goal : g) }));
  const deleteGoal = (id: string) => setState(s => ({ ...s, goals: s.goals.filter(g => g.id !== id) }));
  const addCategory = (category: string) => setState(s => ({ ...s, categories: [...s.categories, category] }));
  const deleteCategory = (category: string) => setState(s => ({ ...s, categories: s.categories.filter(c => c !== category) }));
  
  const addBudget = (budget: Budget) => setState(s => ({ ...s, budgets: [...s.budgets, budget] }));
  const updateBudget = (budget: Budget) => setState(s => ({ ...s, budgets: s.budgets.map(b => b.id === budget.id ? budget : b) }));
  const deleteBudget = (id: string) => setState(s => ({ ...s, budgets: s.budgets.filter(b => b.id !== id) }));
  
  const addSubscription = (subscription: Subscription) => setState(s => ({ ...s, subscriptions: [...s.subscriptions, subscription] }));
  const updateSubscription = (subscription: Subscription) => setState(s => ({ ...s, subscriptions: s.subscriptions.map(sub => sub.id === subscription.id ? subscription : sub) }));
  const deleteSubscription = (id: string) => setState(s => ({ ...s, subscriptions: s.subscriptions.filter(sub => sub.id !== id) }));
  
  const addAccount = (account: Account) => setState(s => ({ ...s, accounts: [...s.accounts, account] }));
  const updateAccount = (account: Account) => setState(s => ({ ...s, accounts: s.accounts.map(a => a.id === account.id ? account : a) }));
  const deleteAccount = (id: string) => setState(s => ({ ...s, accounts: s.accounts.filter(a => a.id !== id) }));
  
  const addDebt = (debt: Debt) => setState(s => ({ ...s, debts: [...s.debts, debt] }));
  const updateDebt = (debt: Debt) => setState(s => ({ ...s, debts: s.debts.map(d => d.id === debt.id ? debt : d) }));
  const deleteDebt = (id: string) => setState(s => ({ ...s, debts: s.debts.filter(d => d.id !== id) }));
  
  const addInvestment = (investment: Investment) => setState(s => ({ ...s, investments: [...s.investments, investment] }));
  const updateInvestment = (investment: Investment) => setState(s => ({ ...s, investments: s.investments.map(i => i.id === investment.id ? investment : i) }));
  const deleteInvestment = (id: string) => setState(s => ({ ...s, investments: s.investments.filter(i => i.id !== id) }));

  const setSelectedYear = (year: number) => setState(s => ({ ...s, selectedYear: year }));
  const unlock = () => setState(s => ({ ...s, isLocked: false }));
  const lock = () => setState(s => ({ ...s, isLocked: !!s.profile?.password }));
  const completeOnboarding = () => setState(s => ({ ...s, hasCompletedOnboarding: true }));
  const toggleTheme = () => setState(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));

  return (
    <StoreContext.Provider value={{
      ...state,
      setProfile, addTransaction, updateTransaction, deleteTransaction,
      addGoal, updateGoal, deleteGoal, addCategory, deleteCategory,
      addBudget, updateBudget, deleteBudget,
      addSubscription, updateSubscription, deleteSubscription,
      addAccount, updateAccount, deleteAccount,
      addDebt, updateDebt, deleteDebt,
      addInvestment, updateInvestment, deleteInvestment,
      setSelectedYear, unlock, lock, completeOnboarding, toggleTheme
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
