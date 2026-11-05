import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link, useOutletContext } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Trash2,
  Copy,
  Check,
  Brain,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { memoryService } from '../services/memoryService';
import { Memory } from '../types/memory';
import { ImportanceMeter } from '../components/common/ImportanceMeter';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmModal } from '../components/common/ConfirmModal';
import toast from 'react-hot-toast';

export const MemoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshGlobalStats } = useOutletContext<{ refreshGlobalStats: () => void }>();

  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchMemory = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await memoryService.getMemoryById(id);
      setMemory(res.memory);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch memory details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMemory();
  }, [fetchMemory]);

  const copyMemoryId = () => {
    if (!memory) return;
    navigator.clipboard.writeText(memory.id);
    setCopied(true);
    toast.success('Memory ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const copyContent = () => {
    if (!memory) return;
    navigator.clipboard.writeText(memory.content);
    toast.success('Memory content copied to clipboard');
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await memoryService.deleteMemory(id);
      toast.success('Memory deleted successfully');
      refreshGlobalStats();
      navigate('/memories');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete memory');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Retrieving memory details..." />;
  }

  if (error || !memory) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Memory Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          {error || 'The memory you requested does not exist or has already been deleted.'}
        </p>
        <div className="pt-4">
          <Link
            to="/memories"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Memories</span>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(memory.created_at).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/memories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Memories</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={copyContent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Content</span>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 space-y-6">
        {/* Header Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Memory Identifier
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-sm font-semibold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                {memory.id}
              </span>
              <button
                onClick={copyMemoryId}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
                title="Copy ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Importance Rating
            </span>
            <div className="mt-1 flex sm:justify-end">
              <ImportanceMeter score={memory.importance} />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Stored Knowledge / Content
          </span>
          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-slate-800 text-base leading-relaxed whitespace-pre-wrap font-normal selection:bg-brand-100">
            {memory.content}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Saved: {formattedDate}</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span>Length: {memory.content.length} characters</span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Memory"
        message="Are you sure you want to permanently delete this memory? It will be removed from your AI second brain immediately."
        confirmText="Delete Permanently"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

