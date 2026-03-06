import React from 'react';
import { useStore } from '../store';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BarChart3, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  FileText, 
  Settings 
} from 'lucide-react';
import { cn } from '../lib/utils';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'daily', label: 'Daily Log', icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'forecast', label: 'Forecast', icon: TrendingUp },
  { id: 'strategy', label: 'Strategy', icon: Lightbulb },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  const { profile } = useStore();

  return (
    <div className="w-64 bg-white border-r border-zinc-200 flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-zinc-100">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: profile?.accentColor || '#3b82f6' }}
        >
          F
        </div>
        <span className="font-bold text-xl tracking-tight">FinTrack Pro</span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive 
                  ? "bg-zinc-100 text-zinc-900" 
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-zinc-900" : "text-zinc-400")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-zinc-100">
        <div className="flex items-center gap-3 px-3 py-2">
          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 font-medium">
              {profile?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className="text-sm font-medium text-zinc-900">{profile?.name || 'User'}</span>
            <span className="text-xs text-zinc-500">Pro Member</span>
          </div>
        </div>
      </div>
    </div>
  );
}
