import { AppState } from '../types';

const STORAGE_KEY = 'fintrack_pro_data';

export const defaultState: AppState = {
  profile: null,
  transactions: [],
  goals: [],
  categories: ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'],
  budgets: [],
  subscriptions: [],
  accounts: [],
  debts: [],
  investments: [],
  selectedYear: new Date().getFullYear(),
  isLocked: false,
  hasCompletedOnboarding: false,
  theme: 'dark', // Default to premium dark blue
};

export function loadState(): AppState {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return defaultState;
    }
    const state = JSON.parse(serializedState);
    if (state.profile?.password) {
      state.isLocked = true;
    }
    if (!state.theme) state.theme = 'dark';
    if (!state.categories) state.categories = defaultState.categories;
    if (!state.budgets) state.budgets = [];
    if (!state.subscriptions) state.subscriptions = [];
    if (!state.accounts) state.accounts = [];
    if (!state.debts) state.debts = [];
    if (!state.investments) state.investments = [];
    return state;
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return defaultState;
  }
}

export function saveState(state: AppState) {
  try {
    const stateToSave = { ...state, isLocked: false };
    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
}
