import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PlusCircle, Sparkles, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { memoryService } from '../services/memoryService';
import { ImportanceMeter } from '../components/common/ImportanceMeter';
import toast from 'react-hot-toast';

export const AddMemory: React.FC = () => {
  const navigate = useNavigate();
  const { refreshGlobalStats } = useOutletContext<{ refreshGlobalStats: () => void }>();

  const [content, setContent] = useState<string>('');
  const [importance, setImportance] = useState<number>(0.5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const presets = [
    { label: 'Low (0.2)', value: 0.2 },
    { label: 'Normal (0.5)', value: 0.5 },
    { label: 'Important (0.8)', value: 0.8 },
    { label: 'Critical (1.0)', value: 1.0 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmed = content.trim();
    if (!trimmed) {
      setValidationError('Memory content cannot be empty.');
      return;
    }
    if (trimmed.length > 2000) {
      setValidationError('Memory content cannot exceed 2000 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await memoryService.createMemory({
        content: trimmed,
        importance: Number(importance.toFixed(2)),
      });

      toast.success(response.message || 'Memory saved successfully!');
      refreshGlobalStats();
      navigate('/memories');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save memory');
      setValidationError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8">
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-slate-100">
          <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Add New Memory</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Record ideas, technical notes, or facts into your AI second brain.
            </p>
          </div>
        </div>

        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold">Validation Issue</p>
              <p className="text-xs mt-0.5">{validationError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="content" className="text-sm font-semibold text-slate-800">
                Memory Content <span className="text-rose-500">*</span>
              </label>
              <span className={`text-xs ${content.length > 2000 ? 'text-rose-500 font-semibold' : 'text-slate-400'}`}>
                {content.length} / 2000
              </span>
            </div>
            <textarea
              id="content"
              rows={6}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="E.g., In Python FastAPI, specific static routes like /api/memories/search must be declared before dynamic path parameters like /api/memories/{memory_id}..."
              className="w-full px-4 py-3 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400 resize-y"
              required
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Plain text or markdown notes. Keywords in this text will be indexed for instant retrieval.
            </p>
          </div>

          {/* Importance Field */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-slate-800">Importance Score</label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Determines ranking when answering questions or searching.
                </p>
              </div>
              <ImportanceMeter score={importance} />
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={importance}
                onChange={(e) => setImportance(parseFloat(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>0.0 (Low)</span>
                <span>0.5 (Default)</span>
                <span>1.0 (Critical)</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60">
              <span className="text-xs text-slate-500 font-medium self-center mr-1">Presets:</span>
              {presets.map((preset) => (
                <button
                  type="button"
                  key={preset.value}
                  onClick={() => setImportance(preset.value)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    Math.abs(importance - preset.value) < 0.01
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/memories')}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving to Brain...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Memory</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

