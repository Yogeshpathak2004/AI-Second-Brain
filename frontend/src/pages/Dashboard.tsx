import React, { useEffect, useState, useCallback } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Brain,
  Plus,
  Search,
  MessageSquareText,
  Sparkles,
  Layers,
  Flame,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { memoryService } from '../services/memoryService';
import { Memory } from '../types/memory';
import { StatCard } from '../components/dashboard/StatCard';
import { MemoryCard } from '../components/memories/MemoryCard';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmModal } from '../components/common/ConfirmModal';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { refreshGlobalStats } = useOutletContext<{ refreshGlobalStats: () => void }>();

  const [memories, setMemories] = useState<Memory[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [backendHealth, setBackendHealth] = useState<string>('Checking...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Delete modal state
  const [memoryToDelete, setMemoryToDelete] = useState<Memory | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadDashboardData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const [memoriesRes, healthRes] = await Promise.all([
        memoryService.getMemories(),
        memoryService.getHealth(),
      ]);

      setMemories(memoriesRes.memories || []);
      setTotalCount(memoriesRes.count || healthRes.total_memories || 0);
      setBackendHealth(healthRes.status === 'healthy' ? 'Operational' : 'Unavailable');
      if (isManualRefresh) toast.success('Dashboard synced with backend');
    } catch (err: any) {
      setBackendHealth('Offline');
      if (isManualRefresh) toast.error('Failed to sync with backend');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Derived stats
  const highPriorityCount = React.useMemo(() => {
    return memories.filter((m) => m.importance >= 0.8).length;
  }, [memories]);

  const recentMemories = React.useMemo(() => {
    return [...memories]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4);
  }, [memories]);

  // Handle Delete
  const confirmDelete = async () => {
    if (!memoryToDelete) return;
    setIsDeleting(true);
    try {
      await memoryService.deleteMemory(memoryToDelete.id);
      toast.success('Memory deleted successfully');
      setMemoryToDelete(null);
      await loadDashboardData();
      refreshGlobalStats();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete memory');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Overview Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-brand-500/20 text-brand-300 border border-brand-400/30 mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Second Brain v0.2.0</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome to your second brain.
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Store critical thoughts, project notes, learning progress, and let your AI
            intelligence retrieve and recall relevant context instantly.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-md shadow-brand-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Memory</span>
            </Link>
            <Link
              to="/ask"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm border border-white/10"
            >
              <MessageSquareText className="w-4 h-4 text-brand-400" />
              <span>Ask AI Brain</span>
            </Link>
            <button
              onClick={() => loadDashboardData(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-all border border-slate-700 disabled:opacity-50"
              title="Refresh data from backend"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Memories"
          value={isLoading ? '...' : totalCount}
          subtitle="Persistent indexed items"
          icon={Brain}
          color="brand"
        />
        <StatCard
          title="High Priority"
          value={isLoading ? '...' : highPriorityCount}
          subtitle="Importance score ≥ 80%"
          icon={Flame}
          color="amber"
        />
        <StatCard
          title="Backend API"
          value={backendHealth}
          subtitle="FastAPI @ 127.0.0.1:8000"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Storage Mode"
          value="In-Memory"
          subtitle="Active CRUD memory pool"
          icon={Layers}
          color="indigo"
        />
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/add"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
              Quick Add Memory
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Capture a new thought, learning log, or fact with custom importance weight.
            </p>
          </div>
        </Link>

        <Link
          to="/search"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Keyword Search
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Instantly search through all your stored knowledge with word-matching filters.
            </p>
          </div>
        </Link>

        <Link
          to="/ask"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <MessageSquareText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Ask Second Brain
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Query your brain naturally to retrieve related thoughts and answers.
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Memories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Memories</h3>
            <p className="text-xs text-slate-500">Latest thoughts stored in your second brain</p>
          </div>
          {memories.length > 0 && (
            <Link
              to="/memories"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              <span>View all ({totalCount})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading memories from backend..." />
        ) : recentMemories.length === 0 ? (
          <EmptyState
            title="No memories recorded yet"
            description="Start building your second brain by capturing your first thought, study note, or insight."
            actionText="Add First Memory"
            onAction={() => window.location.assign('/add')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentMemories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onDelete={(m) => setMemoryToDelete(m)}
                compact
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!memoryToDelete}
        title="Delete Memory"
        message={`Are you sure you want to permanently delete this memory? This action cannot be undone.`}
        confirmText="Delete Memory"
        isDestructive
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setMemoryToDelete(null)}
      />
    </div>
  );
};

