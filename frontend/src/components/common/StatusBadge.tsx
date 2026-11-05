import React from 'react';
import { Activity, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'healthy' | 'offline' | 'checking';
  totalMemories?: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, totalMemories }) => {
  if (status === 'healthy') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Backend Online</span>
        {totalMemories !== undefined && (
          <span className="text-emerald-600/70">({totalMemories} memories)</span>
        )}
      </div>
    );
  }

  if (status === 'checking') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <Activity className="w-3.5 h-3.5 text-amber-600 animate-spin" />
        <span>Connecting to API...</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
      <span>Backend Offline (127.0.0.1:8000)</span>
    </div>
  );
};

