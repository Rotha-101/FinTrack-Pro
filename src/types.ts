export interface UserProfile {
  name: string;
  salary: number;
  dailyBudget: number;
  password?: string;
  photoUrl?: string;
  accentColor: string;
  currency: string;
  notificationsEnabled?: boolean;
  financialYearStart?: number;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: string;
  type: TransactionType;
  note: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
  deadline?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit';
  balance: number;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  totalAmount: number;
  dueDate: string;
  type: 'owed_by_me' | 'owed_to_me';
}

export interface Investment {
  id: string;
  symbol: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
}

export interface AppState {
  profile: UserProfile | null;
  transactions: Transaction[];
  goals: Goal[];
  categories: string[];
  budgets: Budget[];
  subscriptions: Subscription[];
  accounts: Account[];
  debts: Debt[];
  investments: Investment[];
  selectedYear: number;
  isLocked: boolean;
  hasCompletedOnboarding: boolean;
  theme: 'light' | 'dark';
}
