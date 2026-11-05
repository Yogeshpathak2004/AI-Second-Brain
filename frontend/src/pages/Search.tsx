import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Sparkles, Brain, ArrowRight } from 'lucide-react';
import { memoryService } from '../services/memoryService';
import { Memory } from '../types/memory';
import { MemoryCard } from '../components/memories/MemoryCard';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmModal } from '../components/common/ConfirmModal';
import toast from 'react-hot-toast';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<Memory[] | null>(null);
  const [searchedQuery, setSearchedQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Delete modal state
  const [memoryToDelete, setMemoryToDelete] = useState<Memory | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const sampleKeywords = ['FastAPI', 'React', 'Python', 'Machine Learning', 'API'];

  const executeSearch = async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      toast.error('Please enter a search term');
      return;
    }

    setIsLoading(true);
    setSearchedQuery(trimmed);
    setSearchParams({ q: trimmed });

    try {
      const response = await memoryService.searchMemories(trimmed);
      setResults(response.memories || []);
    } catch (err: any) {
      toast.error(err.message || 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setSearchedQuery('');
    setSearchParams({});
  };

  const confirmDelete = async () => {
    if (!memoryToDelete) return;
    setIsDeleting(true);
    try {
      await memoryService.deleteMemory(memoryToDelete.id);
      toast.success('Memory deleted successfully');
      setMemoryToDelete(null);
      // Re-run search if active
      if (searchedQuery) {
        await executeSearch(searchedQuery);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete memory');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <SearchIcon className="w-6 h-6 text-brand-600" />
          <span>Search Second Brain</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Perform keyword-matching queries across your entire indexed memory storage.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search concepts, technical facts, or keywords (e.g. FastAPI, Python)..."
              className="w-full pl-12 pr-28 py-3.5 text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
              autoFocus
            />
            <div className="absolute right-2.5 flex items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-sm shadow-brand-500/25 disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Quick Keyword Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-medium">Quick suggestions:</span>
            {sampleKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => {
                  setQuery(kw);
                  executeSearch(kw);
                }}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 text-slate-600 rounded-lg border border-slate-200/80 transition-all"
              >
                {kw}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Search Results Section */}
      <div className="space-y-4">
        {isLoading && (
          <LoadingSpinner message={`Searching memory index for "${searchedQuery}"...`} />
        )}

        {!isLoading && results !== null && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Search Results</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {results.length} found
                </span>
              </h2>
              {searchedQuery && (
                <span className="text-xs text-slate-400">
                  Query: <code className="font-mono text-slate-700 font-medium">"{searchedQuery}"</code>
                </span>
              )}
            </div>

            {results.length === 0 ? (
              <EmptyState
                title="No memories matched your query"
                description={`We couldn't find any memories containing the words in "${searchedQuery}". Try another keyword or question.`}
                icon={Brain}
                actionText="Clear Search"
                onAction={handleClear}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    onDelete={(m) => setMemoryToDelete(m)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {!isLoading && results === null && (
          <div className="text-center py-16 px-4 bg-white/50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Ready to search</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Type keywords above or click on one of the quick suggestions to search through your second brain.
            </p>
          </div>
        )}
      </div>

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

