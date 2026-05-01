import { useState, useEffect, useCallback } from 'react';
import type { MatrixCellResponse, Phase, CoordinationDomain, CoordinationType } from '../types/study';
import { COORDINATION_TYPES } from '../data/coordinationTypes';

interface Props {
  phase: Phase;
  domain: CoordinationDomain;
  initialData: MatrixCellResponse;
  onSave: (data: MatrixCellResponse) => void;
  onClose: () => void;
}

export default function CellEditorModal({ phase, domain, initialData, onSave, onClose }: Props) {
  const [data, setData] = useState<MatrixCellResponse>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleType = (type: CoordinationType) => {
    const has = data.coordination_types.includes(type);
    setData({
      ...data,
      coordination_types: has
        ? data.coordination_types.filter((t) => t !== type)
        : [...data.coordination_types, type],
    });
  };

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  const handleClear = () => {
    setData({
      phase,
      domain,
      marked_important: false,
      coordination_types: [],
      issue_note: '',
      producer_decision_note: '',
      success_criterion_note: '',
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-lg border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-sm">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-start z-10">
          <div>
            <div className="text-xs text-slate-400 mb-0.5">{phase}</div>
            <div className="text-sm font-semibold text-slate-800">{domain}</div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none p-1 -mr-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Importance */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={data.marked_important}
                onChange={(e) => setData({ ...data, marked_important: e.target.checked })}
                className="w-4 h-4 accent-slate-700 cursor-pointer"
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                This matters in this phase
              </span>
            </label>
          </div>

          {/* Coordination types */}
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Coordination / constraint type
            </div>
            <div className="space-y-2">
              {COORDINATION_TYPES.map(({ type, shortLabel, colorClass, dotClass }) => {
                const active = data.coordination_types.includes(type);
                return (
                  <label
                    key={type}
                    className={`flex items-center gap-3 p-2.5 rounded border cursor-pointer transition-colors text-sm ${
                      active
                        ? `${colorClass} border-current`
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleType(type)}
                      className="sr-only"
                    />
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotClass}`} />
                    <span>{type}</span>
                    {active && (
                      <span className={`ml-auto text-xs font-semibold px-1.5 py-0.5 rounded ${colorClass}`}>
                        {shortLabel}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              What specific issue, constraint, or decision comes to mind here?
            </label>
            <textarea
              value={data.issue_note}
              onChange={(e) => setData({ ...data, issue_note: e.target.value })}
              placeholder="e.g. actor arrived late, drone permit, noise limit, edit continuity…"
              rows={2}
              className="w-full text-sm border border-slate-200 rounded px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              If this became a problem, how would a producer decide what to do?
            </label>
            <textarea
              value={data.producer_decision_note}
              onChange={(e) => setData({ ...data, producer_decision_note: e.target.value })}
              placeholder="Describe how the producer would reason through the decision…"
              rows={2}
              className="w-full text-sm border border-slate-200 rounded px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              How would you know the producer made a successful decision?
            </label>
            <textarea
              value={data.success_criterion_note}
              onChange={(e) => setData({ ...data, success_criterion_note: e.target.value })}
              placeholder="e.g. shoot completed, creative intention preserved, no compliance violation…"
              rows={2}
              className="w-full text-sm border border-slate-200 rounded px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Clear cell
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-slate-800 text-white text-sm rounded hover:bg-slate-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
