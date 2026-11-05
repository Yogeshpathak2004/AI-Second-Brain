import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface HeaderProps {
  backendStatus: 'healthy' | 'offline' | 'checking';
  totalMemories?: number;
}

export const Header: React.FC<HeaderProps> = ({ backendStatus, totalMemories }) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 shadow-sm/50 sticky top-0 z-30">
      {/* Quick Search Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={() => navigate('/search')}
          className="w-full flex items-center gap-3 px-3.5 py-2 text-sm text-slate-400 bg-slate-100/70 border border-slate-200/60 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all text-left shadow-inner"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="flex-1">Search memories or concepts...</span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono font-medium px-1.5 py-0.5 text-slate-400 bg-white border border-slate-200 rounded">
            /
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3.5">
        <StatusBadge status={backendStatus} totalMemories={totalMemories} />
        <Link
          to="/add"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-500/25 transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New Memory</span>
        </Link>
      </div>
    </header>
  );
};

