import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trash2, ArrowUpRight, Copy, Check } from 'lucide-react';
import { Memory } from '../../types/memory';
import { ImportanceMeter } from '../common/ImportanceMeter';
import toast from 'react-hot-toast';

interface MemoryCardProps {
  memory: Memory;
  onDelete?: (memory: Memory) => void;
  compact?: boolean;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onDelete,
  compact = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  const formattedDate = React.useMemo(() => {
    try {
      return new Date(memory.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return memory.created_at;
    }
  }, [memory.created_at]);

  const copyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(memory.id);
    setCopied(true);
    toast.success('Memory ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header: Importance & Date */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <ImportanceMeter score={memory.importance} size="sm" />
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Content */}
        <p className={`text-slate-800 text-sm leading-relaxed font-normal whitespace-pre-wrap ${compact ? 'line-clamp-3' : ''}`}>
          {memory.content}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          onClick={copyId}
          title="Click to copy ID"
          className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded border border-slate-200/60 transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{memory.id.slice(0, 8)}...</span>
        </button>

        <div className="flex items-center gap-1.5">
          {onDelete && (
            <button
              onClick={() => onDelete(memory)}
              title="Delete memory"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <Link
            to={`/memories/${memory.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg font-medium transition-colors"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

