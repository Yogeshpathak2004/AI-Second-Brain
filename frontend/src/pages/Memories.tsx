import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Brain,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { memoryService } from '../services/memoryService';
import { Memory } from '../types/memory';
import { MemoryCard } from '../components/memories/MemoryCard';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmModal } from '../components/common/ConfirmModal';
import toast from 'react-hot-toast';

export const Memories: React.FC = () => {
  const { refreshGlobalStats } = useOutletContext<{ refreshGlobalStats: () => void }>();

  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [importanceFilter, setImportanceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'importance'>('newest');

  // Delete modal state
  const [memoryToDelete, setMemoryToDelete] = useState<Memory | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchMemories = useCallback(async (manual = false) => {
    if (manual) setIsRefreshing(true);
    try {
      const res = await memoryService.getMemories();
      setMemories(res.memories || []);
      if (manual) toast.success('Memories refreshed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to load memories');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  // Filter and sort memories
  const filteredMemories = useMemo(() => {
    return memories
      .filter((memory) => {
        // Text search
        if (searchTerm.trim()) {
          const matchContent = memory.content.toLowerCase().includes(searchTerm.toLowerCase());
          const matchId = memory.id.toLowerCase().includes(searchTerm.toLowerCase());
          if (!matchContent && !matchId) return false;
        }

        // Importance filter
        if (importanceFilter === 'high') return memory.importance >= 0.8;
        if (importanceFilter === 'medium') return memory.importance >= 0.5 && memory.importance < 0.8;
        if (importanceFilter === 'low') return memory.importance < 0.5;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === 'importance') {
          return b.importance - a.importance;
        }
        return 0;
      });
  }, [memories, searchTerm, importanceFilter, sortBy]);

  // Confirm delete
  const confirmDelete = async () => {
    if (!memoryToDelete) return;
    setIsDeleting(true);
    try {
      await memoryService.deleteMemory(memoryToDelete.id);
      toast.success('Memory deleted successfully');
      setMemoryToDelete(null);
      await fetchMemories();
      refreshGlobalStats();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete memory');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>My Memories</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {memories.length} Total
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, filter, and manage your complete long-term personal knowledge base.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchMemories(true)}
            disabled={isRefreshing}
            className="p-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            title="Refresh memory list"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        {/* Quick filter input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter memories by keyword or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Importance Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={importanceFilter}
            onChange={(e) => setImportanceFilter(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="all">All Importance</option>
            <option value="high">High Priority (≥ 80%)</option>
            <option value="medium">Medium (50% - 79%)</option>
            <option value="low">Low (&lt; 50%)</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="importance">Sort: Highest Importance</option>
          </select>
        </div>
      </div>

      {/* Memory Cards Grid */}
      {isLoading ? (
        <LoadingSpinner message="Fetching memories from your second brain..." />
      ) : filteredMemories.length === 0 ? (
        <EmptyState
          title={searchTerm || importanceFilter !== 'all' ? 'No matching memories found' : 'Your memory vault is empty'}
          description={
            searchTerm || importanceFilter !== 'all'
              ? 'Try adjusting your search keywords or clear your filter settings.'
              : 'Add your first thought, article summary, or coding note to begin.'
          }
          icon={Brain}
          actionText={searchTerm || importanceFilter !== 'all' ? 'Clear Filters' : 'Add First Memory'}
          onAction={() => {
            if (searchTerm || importanceFilter !== 'all') {
              setSearchTerm('');
              setImportanceFilter('all');
            } else {
              window.location.assign('/add');
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onDelete={(m) => setMemoryToDelete(m)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!memoryToDelete}
        title="Delete Memory"
        message="Are you sure you want to permanently delete this memory? This action cannot be undone."
        confirmText="Delete Memory"
        isDestructive
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setMemoryToDelete(null)}
      />
    </div>
  );
};

