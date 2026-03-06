import React, { useState } from 'react';
import { useStore } from '../store';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Lock, DollarSign, User } from 'lucide-react';

export function Onboarding() {
  const { setProfile, completeOnboarding } = useStore();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<UserProfile>>({
    name: '',
    salary: 0,
    dailyBudget: 0,
    password: '',
    accentColor: '#3b82f6',
    currency: 'USD',
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      setProfile(data as UserProfile);
      completeOnboarding();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 flex items-center justify-center p-6 font-sans transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-zinc-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Welcome to FinTrack Pro</h1>
            <span className="text-sm font-medium text-zinc-400 dark:text-slate-500">Step {step} of 4</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-white">What should we call you?</h2>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-slate-500 w-5 h-5" />
                  <input
                    type="text"
                    value={data.name}
                    onChange={e => setData({ ...data, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-white">What's your annual salary?</h2>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-slate-500 w-5 h-5" />
                  <input
                    type="number"
                    value={data.salary || ''}
                    onChange={e => setData({ ...data, salary: Number(e.target.value) })}
                    placeholder="e.g. 75000"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    autoFocus
                  />
                </div>
                <p className="text-sm text-zinc-500 dark:text-slate-400 mt-3">This helps us calculate your financial health grade.</p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-white">Set a daily spending budget</h2>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-slate-500 w-5 h-5" />
                  <input
                    type="number"
                    value={data.dailyBudget || ''}
                    onChange={e => setData({ ...data, dailyBudget: Number(e.target.value) })}
                    placeholder="e.g. 50"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    autoFocus
                  />
                </div>
                <p className="text-sm text-zinc-500 dark:text-slate-400 mt-3">We'll track your daily spending against this goal.</p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-white">Secure your data (Optional)</h2>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-slate-500 w-5 h-5" />
                  <input
                    type="password"
                    value={data.password || ''}
                    onChange={e => setData({ ...data, password: e.target.value })}
                    placeholder="Enter a password"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    autoFocus
                  />
                </div>
                <p className="text-sm text-zinc-500 dark:text-slate-400 mt-3">Leave blank if you don't want a lock screen.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 flex justify-end">
            <button
              onClick={handleNext}
              disabled={step === 1 && !data.name}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {step === 4 ? 'Complete Setup' : 'Continue'}
              {step === 4 ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-slate-800">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
