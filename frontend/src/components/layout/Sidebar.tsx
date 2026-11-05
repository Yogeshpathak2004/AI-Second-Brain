import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BrainCircuit,
  PlusCircle,
  Search,
  MessageSquareText,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  memoryCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ memoryCount }) => {
  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/memories',
      label: 'My Memories',
      icon: BrainCircuit,
      badge: memoryCount !== undefined ? memoryCount : null,
    },
    {
      to: '/add',
      label: 'Add Memory',
      icon: PlusCircle,
      badge: null,
    },
    {
      to: '/search',
      label: 'Search Memories',
      icon: Search,
      badge: null,
    },
    {
      to: '/ask',
      label: 'Ask Second Brain',
      icon: MessageSquareText,
      badge: 'AI',
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-200 flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base tracking-tight leading-none">
            AI Second Brain
          </h1>
          <p className="text-[11px] text-slate-400 mt-1 font-mono tracking-wider uppercase">
            Intelligence System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    item.badge === 'AI'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-slate-300">FastAPI Engine</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">http://127.0.0.1:8000</p>
        </div>
      </div>
    </aside>
  );
};

