import React from 'react';

interface ImportanceMeterProps {
  score: number; // 0.0 to 1.0
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const ImportanceMeter: React.FC<ImportanceMeterProps> = ({
  score,
  showLabel = true,
  size = 'md',
}) => {
  const percentage = Math.round(score * 100);

  // Determine color theme based on score thresholds
  let color = 'bg-brand-500 text-brand-700';
  let badgeBg = 'bg-brand-50 border-brand-200 text-brand-700';
  let label = 'Normal';

  if (score >= 0.8) {
    color = 'bg-amber-500';
    badgeBg = 'bg-amber-50 border-amber-200 text-amber-700';
    label = 'High Priority';
  } else if (score >= 0.5) {
    color = 'bg-indigo-500';
    badgeBg = 'bg-indigo-50 border-indigo-200 text-indigo-700';
    label = 'Medium';
  } else {
    color = 'bg-slate-400';
    badgeBg = 'bg-slate-50 border-slate-200 text-slate-600';
    label = 'Low';
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-20 bg-slate-100 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2'}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${badgeBg}`}>
          {label} ({percentage}%)
        </span>
      )}
    </div>
  );
};

