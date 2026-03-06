import React, { useState, useRef } from 'react';
import { useStore } from '../store';
import { UserProfile } from '../types';
import { Save, Upload, Lock, User, DollarSign, Palette, Globe, Bell, Download, Trash2, Tag, Plus, X } from 'lucide-react';

export function SettingsTab() {
  const { profile, setProfile, categories, addCategory, deleteCategory, transactions, goals } = useStore();
  const [formData, setFormData] = useState<UserProfile>(profile!);
  const [isSaved, setIsSaved] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#6366f1'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportData = () => {
    const data = {
      profile,
      transactions,
      goals
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      localStorage.removeItem('fintrack-storage');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Profile Settings</h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          {isSaved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Photo & Theme */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800 shadow-sm text-center transition-colors">
            <div className="relative inline-block mb-4">
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-zinc-100 dark:bg-slate-800 flex items-center justify-center text-zinc-400 dark:text-slate-500 border-4 border-white dark:border-slate-800 shadow-md">
                  <User className="w-12 h-12" />
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-zinc-900 dark:bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-zinc-800 dark:hover:bg-blue-500 transition-colors"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">{formData.name}</h3>
            <p className="text-zinc-500 dark:text-slate-400 text-sm">Pro Member</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-zinc-200 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-zinc-400 dark:text-slate-500" />
              Accent Color
            </h3>
            <div className="flex flex-wrap gap-3">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setFormData({ ...formData, accentColor: c })}
                  className={`w-10 h-10 rounded-full transition-transform ${formData.accentColor === c ? 'scale-110 ring-4 ring-offset-2 ring-zinc-200 dark:ring-slate-700 dark:ring-offset-slate-900' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-zinc-200 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Personal Details</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-slate-500 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1.5">Annual Salary</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-slate-500 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1.5">Daily Budget Goal</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-slate-500 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.dailyBudget}
                      onChange={e => setFormData({ ...formData, dailyBudget: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1.5">Currency</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-slate-500 w-5 h-5" />
                  <select
                    value={formData.currency || 'USD'}
                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="KHR">KHR (៛)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-zinc-200 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-zinc-400 dark:text-slate-500" />
              Preferences
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-zinc-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <div className="font-medium text-zinc-900 dark:text-white">Push Notifications</div>
                  <div className="text-sm text-zinc-500 dark:text-slate-400">Receive daily reminders to log expenses</div>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input 
                    type="checkbox" 
                    name="toggle" 
                    id="toggle1" 
                    checked={formData.notificationsEnabled ?? true}
                    onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-zinc-300 dark:border-slate-600 checked:right-0 checked:border-blue-600" 
                  />
                  <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-zinc-300 dark:bg-slate-600 cursor-pointer"></label>
                </div>
              </label>
              <div className="p-4 border border-zinc-200 dark:border-slate-700 rounded-xl transition-colors">
                <div className="mb-3">
                  <div className="font-medium text-zinc-900 dark:text-white">Financial Year Start</div>
                  <div className="text-sm text-zinc-500 dark:text-slate-400">Choose the starting month for your financial year</div>
                </div>
                <select
                  value={formData.financialYearStart || 1}
                  onChange={e => setFormData({ ...formData, financialYearStart: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
                >
                  {Array.from({length: 12}).map((_, i) => (
                    <option key={i} value={i + 1}>{new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-zinc-200 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-zinc-400 dark:text-slate-500" />
              Security
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-zinc-500 dark:text-slate-400 mb-4">Set a password to lock the app when you're away. Leave blank to disable the lock screen.</p>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1.5">App Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-slate-500 w-5 h-5" />
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-zinc-200 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-zinc-400 dark:text-slate-500" />
              Manage Categories
            </h3>
            <div className="space-y-4">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 px-4 py-2.5 bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!newCategory.trim()}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center gap-2 bg-zinc-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-slate-700">
                    <span className="text-sm text-zinc-700 dark:text-slate-300">{cat}</span>
                    <button
                      onClick={() => deleteCategory(cat)}
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-red-200 dark:border-red-900/30 shadow-sm transition-colors">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 border border-red-100 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/10 rounded-xl">
                <div>
                  <div className="font-medium text-zinc-900 dark:text-white">Export Data</div>
                  <div className="text-sm text-zinc-500 dark:text-slate-400">Download a JSON backup of all your data</div>
                </div>
                <button type="button" onClick={handleExportData} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-slate-700 transition-colors dark:text-white">
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 border border-red-100 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/10 rounded-xl">
                <div>
                  <div className="font-medium text-zinc-900 dark:text-white">Clear All Data</div>
                  <div className="text-sm text-red-500 dark:text-red-400">Permanently delete all transactions and settings</div>
                </div>
                <button type="button" onClick={handleClearData} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
