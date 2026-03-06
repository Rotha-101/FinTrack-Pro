import React, { useState } from 'react';
import { useStore } from '../store';
import { Lock, Unlock } from 'lucide-react';
import { motion } from 'motion/react';

export function LockScreen() {
  const { profile, unlock } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === profile?.password) {
      unlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800 text-center"
      >
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-slate-300" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">App Locked</h1>
        <p className="text-slate-400 text-sm mb-8">Enter your password to access FinTrack Pro</p>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full bg-slate-950 border ${error ? 'border-red-500' : 'border-slate-700'} text-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-center tracking-widest`}
              autoFocus
            />
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-red-400 text-xs absolute -bottom-6 left-0 right-0"
              >
                Incorrect password
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Unlock className="w-4 h-4" />
            Unlock
          </button>
        </form>
      </motion.div>
    </div>
  );
}
