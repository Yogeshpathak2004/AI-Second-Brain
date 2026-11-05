import React, { useState } from 'react';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Bot,
  User,
  Brain,
  Layers,
  ArrowRight,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { askService } from '../services/askService';
import { Memory, AskResponse } from '../types/memory';
import { MemoryCard } from '../components/memories/MemoryCard';
import toast from 'react-hot-toast';

interface ChatTurn {
  id: string;
  query: string;
  answer: string;
  memoriesUsed: Memory[];
  timestamp: Date;
}

export const AskBrain: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([]);

  const exampleQuestions = [
    'What am I learning about FastAPI?',
    'What are my notes on React and TypeScript?',
    'Tell me about my high priority memories',
    'What technical skills have I recorded?',
  ];

  const handleAsk = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed) {
      toast.error('Please enter a question');
      return;
    }

    setIsLoading(true);
    setQuery('');

    try {
      const response: AskResponse = await askService.askQuestion({ query: trimmed });

      const newTurn: ChatTurn = {
        id: crypto.randomUUID(),
        query: response.query,
        answer: response.answer,
        memoriesUsed: response.memories_used || [],
        timestamp: new Date(),
      };

      setChatHistory((prev) => [newTurn, ...prev]);
    } catch (err: any) {
      toast.error(err.message || 'Failed to query second brain');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(query);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <MessageSquareText className="w-6 h-6 text-brand-600" />
          <span>Ask Your Second Brain</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Query your stored memory index using natural questions. The engine scans and retrieves matching memories.
        </p>
      </div>

      {/* Query Input Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything stored in your second brain (e.g. 'What am I learning about FastAPI?')..."
              className="w-full px-4 py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (query.trim() && !isLoading) {
                    handleAsk(query);
                  }
                }
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Press Enter to send (Shift + Enter for newline)</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning Memories...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Ask Brain</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Example Questions */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
            Example Queries
          </span>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((qText) => (
              <button
                key={qText}
                type="button"
                onClick={() => handleAsk(qText)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 text-slate-600 rounded-xl border border-slate-200 transition-all text-left flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-brand-500" />
                <span>{qText}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation / Query Results */}
      <div className="space-y-6">
        {chatHistory.length === 0 && !isLoading && (
          <div className="text-center py-12 px-4 bg-white/60 rounded-3xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No questions asked yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Ask a question above or click one of the suggested example queries to see what your second brain recalls.
            </p>
          </div>
        )}

        {chatHistory.map((turn) => (
          <div
            key={turn.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-6"
          >
            {/* User Question */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    You Asked
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {turn.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="mt-1 text-sm sm:text-base font-medium text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {turn.query}
                </p>
              </div>
            </div>

            {/* Brain Answer */}
            <div className="flex items-start gap-3.5 pt-2">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Second Brain Answer</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                      Backend
                    </span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-brand-50/40 border border-brand-100 text-slate-800 text-sm leading-relaxed">
                  {turn.answer}
                </div>

                {/* Retrieved Memories (Actual backend memories_used) */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Relevant Memories Retrieved ({turn.memoriesUsed.length})
                    </span>
                  </div>

                  {turn.memoriesUsed.length === 0 ? (
                    <div className="p-3.5 rounded-xl bg-slate-50 text-xs text-slate-500 border border-slate-200/60 italic">
                      No matching memories were found in your second brain for this query.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {turn.memoriesUsed.map((mem) => (
                        <MemoryCard key={mem.id} memory={mem} compact />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

